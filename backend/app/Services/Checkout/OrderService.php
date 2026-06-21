<?php
namespace App\Services\Checkout;

use App\Models\Cart;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\WalletTransaction;
use Illuminate\Support\Facades\DB;
use Exception;

class OrderService {
    public function createOrderFromCart($userId) {
        return DB::transaction(function () use ($userId) {
            // 1. Get the user's cart
            $cart = Cart::where('user_id', $userId)->first();
            if (!$cart || $cart->items()->count() === 0) {
                throw new Exception('Cart is empty.');
            }

            $cartItems = $cart->items()->with('product')->get();

            // 2. Validate stock and calculate total amount
            $totalAmount = 0;
            foreach ($cartItems as $item) {
                $product = $item->product;
                if (!$product) {
                    throw new Exception('Product not found in database.');
                }
                if ($product->stock < $item->quantity) {
                    throw new Exception("Product '{$product->name}' has insufficient stock (Only {$product->stock} available).");
                }
                $totalAmount += $product->price * $item->quantity;
            }

            // 3. Check and update user's wallet
            $user = $cart->user;
            if (!$user) {
                throw new Exception('User not found.');
            }
            
            $wallet = $user->wallet ?: $user->wallet()->create(['balance' => 0, 'status' => 'ACTIVE']);

            if ($wallet->balance < $totalAmount) {
                throw new Exception('Insufficient wallet balance. Please top up your wallet.');
            }

            // Deduct from wallet balance
            $wallet->balance -= $totalAmount;
            $wallet->save();

            // Create Wallet Transaction
            WalletTransaction::create([
                'wallet_id' => $wallet->id,
                'type' => 'PURCHASE',
                'amount' => $totalAmount,
                'balance_after' => $wallet->balance,
                'description' => 'Purchase of cart items',
            ]);

            // 4. Create Orders (grouped by store_id)
            $groupedItems = $cartItems->groupBy(function ($item) {
                return $item->product->store_id;
            });

            $orders = [];
            foreach ($groupedItems as $storeId => $items) {
                $orderTotal = 0;
                foreach ($items as $item) {
                    $orderTotal += $item->product->price * $item->quantity;
                }

                // Create Order
                $order = Order::create([
                    'user_id' => $userId,
                    'store_id' => $storeId,
                    'total_amount' => $orderTotal,
                    'shipping_cost' => 0,
                    'status' => 'PAID',
                ]);

                // Create OrderItems and deduct stock
                foreach ($items as $item) {
                    $product = $item->product;
                    
                    OrderItem::create([
                        'order_id' => $order->id,
                        'product_id' => $product->id,
                        'price' => $product->price,
                        'quantity' => $item->quantity,
                    ]);

                    // Deduct stock
                    $product->stock -= $item->quantity;
                    $product->save();
                }

                // Credit Seller's Wallet
                $store = \App\Models\Store::find($storeId);
                if ($store && $store->user) {
                    $seller = $store->user;
                    $sellerWallet = $seller->wallet ?: $seller->wallet()->create(['balance' => 0, 'status' => 'ACTIVE']);
                    
                    // Add funds
                    $sellerWallet->balance += $orderTotal;
                    $sellerWallet->save();

                    // Create Transaction Record
                    WalletTransaction::create([
                        'wallet_id' => $sellerWallet->id,
                        'type' => 'TRANSFER',
                        'amount' => $orderTotal,
                        'balance_after' => $sellerWallet->balance,
                        'description' => 'Sale from order #' . $order->id,
                    ]);
                }

                $orders[] = $order;
            }

            // 5. Clear Cart Items
            $cart->items()->delete();

            return $orders;
        });
    }
}

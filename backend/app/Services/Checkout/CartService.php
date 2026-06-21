<?php
namespace App\Services\Checkout;

use App\Models\Cart;
use App\Models\CartItem;

class CartService {
    public function getCart($userId) {
        return Cart::firstOrCreate(['user_id' => $userId])
            ->load(['items.product.images']);
    }

    public function addToCart($userId, $productId, $quantity = 1) {
        $cart = Cart::firstOrCreate(['user_id' => $userId]);

        $item = $cart->items()->where('product_id', $productId)->first();

        if ($item) {
            $item->quantity += $quantity;
            $item->save();
        } else {
            $item = $cart->items()->create([
                'product_id' => $productId,
                'quantity' => $quantity
            ]);
        }

        return $item->load('product.images');
    }

    public function updateCartItemQuantity($userId, $cartItemId, $quantity) {
        $cart = Cart::where('user_id', $userId)->first();
        if (!$cart) {
            return null;
        }

        $item = $cart->items()->where('id', $cartItemId)->first();
        if ($item) {
            if ($quantity <= 0) {
                $item->delete();
                return null;
            }
            $item->quantity = $quantity;
            $item->save();
        }

        return $item;
    }

    public function removeFromCart($userId, $cartItemId) {
        $cart = Cart::where('user_id', $userId)->first();
        if ($cart) {
            $cart->items()->where('id', $cartItemId)->delete();
        }
        return true;
    }

    public function clearCart($userId) {
        $cart = Cart::where('user_id', $userId)->first();
        if ($cart) {
            $cart->items()->delete();
        }
        return true;
    }
}

<?php
namespace App\Http\Controllers\Api\V1\Checkout;
use App\Http\Controllers\BaseController;
use App\Models\Order;
use Illuminate\Http\Request;

class OrderController extends BaseController {
    public function index(Request $request) {
        $user = auth('api')->user();
        
        // If user has a store, show orders for their store and orders they made
        // But usually, sellers want to see incoming orders, buyers want to see their purchases.
        // We will return two objects: purchases and sales.
        
        $purchases = Order::where('user_id', $user->id)
                          ->with(['items.product', 'store'])
                          ->orderBy('created_at', 'desc')
                          ->get();

        $sales = [];
        if ($user->store) {
            $sales = Order::where('store_id', $user->store->id)
                          ->with(['items.product', 'user'])
                          ->orderBy('created_at', 'desc')
                          ->get();
        }

        return $this->successResponse([
            'purchases' => $purchases,
            'sales' => $sales
        ], 'Orders retrieved');
    }

    public function updateStatus(Request $request, $id) {
        $request->validate([
            'status' => 'required|in:PAID,SHIPPED,COMPLETED,CANCELLED'
        ]);

        $user = auth('api')->user();
        $order = Order::find($id);

        if (!$order) {
            return $this->errorResponse('Order not found', 404);
        }

        // Sellers can update to SHIPPED or CANCELLED
        // Buyers can update to COMPLETED
        if ($user->store && $order->store_id === $user->store->id) {
            if (in_array($request->status, ['SHIPPED', 'CANCELLED'])) {
                $order->status = $request->status;
                $order->save();
                return $this->successResponse($order, 'Order status updated');
            }
        }

        if ($order->user_id === $user->id) {
            if ($request->status === 'COMPLETED') {
                $order->status = $request->status;
                $order->save();
                return $this->successResponse($order, 'Order status updated');
            }
        }

        return $this->errorResponse('Unauthorized to update this order status', 403);
    }
}

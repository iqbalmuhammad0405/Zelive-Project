<?php
namespace App\Http\Controllers\Api\V1\Checkout;
use App\Http\Controllers\BaseController;
use App\Services\Checkout\OrderService;
use Illuminate\Http\Request;

class CheckoutController extends BaseController {
    protected $orderService;

    public function __construct(OrderService $orderService) {
        $this->orderService = $orderService;
    }

    public function process(Request $request) {
        $userId = auth()->id();
        try {
            $orders = $this->orderService->createOrderFromCart($userId);
            return $this->successResponse($orders, 'Checkout successful');
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 400);
        }
    }
}

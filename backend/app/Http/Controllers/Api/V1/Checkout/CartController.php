<?php
namespace App\Http\Controllers\Api\V1\Checkout;
use App\Http\Controllers\BaseController;
use App\Services\Checkout\CartService;
use Illuminate\Http\Request;

class CartController extends BaseController {
    protected $cartService;

    public function __construct(CartService $cartService) {
        $this->cartService = $cartService;
    }

    public function index(Request $request) {
        $userId = auth()->id();
        $cart = $this->cartService->getCart($userId);
        return $this->successResponse($cart, 'Cart retrieved');
    }

    public function store(Request $request) {
        $request->validate([
            'product_id' => 'required|uuid|exists:products,id',
            'quantity' => 'integer|min:1'
        ]);

        $userId = auth()->id();
        $productId = $request->input('product_id');
        $quantity = $request->input('quantity', 1);

        $item = $this->cartService->addToCart($userId, $productId, $quantity);

        return $this->successResponse($item, 'Added to cart successfully');
    }

    public function update(Request $request, $itemId) {
        $request->validate([
            'quantity' => 'required|integer|min:0'
        ]);

        $userId = auth()->id();
        $quantity = $request->input('quantity');

        $item = $this->cartService->updateCartItemQuantity($userId, $itemId, $quantity);

        if (!$item && $quantity > 0) {
            return $this->errorResponse('Cart item not found or not owned by user', 404);
        }

        return $this->successResponse($item, 'Cart item updated successfully');
    }

    public function destroy(Request $request, $itemId) {
        $userId = auth()->id();
        $this->cartService->removeFromCart($userId, $itemId);
        return $this->successResponse(null, 'Item removed from cart');
    }
}

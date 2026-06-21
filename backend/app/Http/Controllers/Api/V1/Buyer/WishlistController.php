<?php
namespace App\Http\Controllers\Api\V1\Buyer;
use App\Http\Controllers\BaseController;
use Illuminate\Http\Request;

class WishlistController extends BaseController {
    public function index() { return $this->successResponse([], 'Wishlist retrieved'); }
    public function store(Request $request) { return $this->successResponse([], 'Added to wishlist'); }
    public function destroy($id) { return $this->successResponse(null, 'Removed from wishlist'); }
}

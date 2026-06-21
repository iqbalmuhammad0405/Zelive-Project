<?php
namespace App\Http\Controllers\Api\V1\Seller;
use App\Http\Controllers\BaseController;
use App\Services\Seller\SellerService;
use Illuminate\Http\Request;

class SellerDashboardController extends BaseController {
    protected $sellerService;
    public function __construct(SellerService $sellerService) {
        $this->sellerService = $sellerService;
    }
    public function index(Request $request) {
        $user = auth('api')->user();
        if (!$user->store) {
            return $this->errorResponse('User does not have a store', 403);
        }
        return $this->successResponse($this->sellerService->getDashboardData($user->store->id), 'Dashboard retrieved');
    }
}

<?php
namespace App\Http\Controllers\Api\V1\Buyer;
use App\Http\Controllers\BaseController;
use App\Services\Buyer\BuyerService;
use Illuminate\Http\Request;

class BuyerDashboardController extends BaseController {
    protected $buyerService;
    public function __construct(BuyerService $buyerService) {
        $this->buyerService = $buyerService;
    }
    public function index() {
        return $this->successResponse($this->buyerService->getDashboardData(), 'Dashboard retrieved');
    }
}

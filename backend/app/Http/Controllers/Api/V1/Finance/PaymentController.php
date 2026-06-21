<?php
namespace App\Http\Controllers\Api\V1\Finance;
use App\Http\Controllers\BaseController;
use Illuminate\Http\Request;

class PaymentController extends BaseController {
    public function uploadProof(Request $request) { return $this->successResponse(null, 'Proof uploaded'); }
    public function history() { return $this->successResponse([], 'Payment history'); }
}

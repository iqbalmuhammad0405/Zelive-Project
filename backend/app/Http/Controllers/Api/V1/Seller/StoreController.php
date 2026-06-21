<?php
namespace App\Http\Controllers\Api\V1\Seller;
use App\Http\Controllers\BaseController;
use Illuminate\Http\Request;

class StoreController extends BaseController {
    public function show($id) { return $this->successResponse([], 'Store retrieved'); }
    public function update(Request $request, $id) { return $this->successResponse([], 'Store updated'); }
}

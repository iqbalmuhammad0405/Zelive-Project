<?php
namespace App\Http\Controllers\Api\V1\Buyer;
use App\Http\Controllers\BaseController;
use Illuminate\Http\Request;

class AddressController extends BaseController {
    public function index() { return $this->successResponse([], 'Addresses retrieved'); }
    public function store(Request $request) { return $this->successResponse([], 'Address created'); }
    public function update(Request $request, $id) { return $this->successResponse([], 'Address updated'); }
    public function destroy($id) { return $this->successResponse(null, 'Address deleted'); }
}

<?php
namespace App\Http\Controllers\Api\V1\Product;
use App\Http\Controllers\BaseController;
use Illuminate\Http\Request;

class CategoryController extends BaseController {
    public function index() { 
        return $this->successResponse(\App\Models\ProductCategory::all(), 'Categories retrieved'); 
    }
}

<?php
namespace App\Http\Controllers\Api\V1\Product;
use App\Http\Controllers\BaseController;
use App\Services\Product\ProductService;
use Illuminate\Http\Request;

class ProductController extends BaseController {
    protected $productService;
    public function __construct(ProductService $productService) {
        $this->productService = $productService;
    }
    public function index(Request $request) {
        $products = $this->productService->searchProducts($request->all());
        $products->load(['store', 'images']);
        return $this->successResponse($products, 'Products retrieved');
    }
    
    public function getSellerProducts(Request $request) {
        $user = $request->user();
        if (!$user->store) {
            return $this->errorResponse('User does not have a store', 403);
        }
        $products = $this->productService->getProductsByStore($user->store->id);
        $products->load(['images', 'category']);
        return $this->successResponse($products, 'Seller products retrieved');
    }

    public function show($id) {
        try {
            $product = $this->productService->getProductById($id);
            $product->load(['store', 'category', 'images']);
            return $this->successResponse($product, 'Product details');
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 404);
        }
    }
    public function store(Request $request) {
        $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'price' => 'required|numeric|min:0',
            'stock' => 'required|integer|min:0',
            'category_id' => 'nullable|exists:product_categories,id',
            'status' => 'nullable|in:DRAFT,PUBLISHED,ARCHIVED,OUT_OF_STOCK'
        ]);

        $user = $request->user();
        if (!$user->store) {
            return $this->errorResponse('User does not have a store', 403);
        }

        $data = $request->all();
        $data['store_id'] = $user->store->id;
        $data['status'] = $data['status'] ?? 'PUBLISHED';
        $data['description'] = $data['description'] ?? ''; // Prevent DB NOT NULL constraint violation

        return $this->successResponse($this->productService->createProduct($data), 'Product created', 201);
    }

    public function update(Request $request, $id) {
        $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'description' => 'nullable|string',
            'price' => 'sometimes|required|numeric|min:0',
            'stock' => 'sometimes|required|integer|min:0',
            'category_id' => 'nullable|exists:product_categories,id'
        ]);

        try {
            $product = $this->productService->getProductById($id);
            
            $user = $request->user();
            if (!$user->store || $product->store_id !== $user->store->id) {
                return $this->errorResponse('Unauthorized to update this product', 403);
            }

            $updatedProduct = $this->productService->updateProduct($id, $request->all());
            return $this->successResponse($updatedProduct, 'Product updated');
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 400);
        }
    }

    public function destroy(Request $request, $id) {
        try {
            $product = $this->productService->getProductById($id);
            
            $user = $request->user();
            if (!$user->store || $product->store_id !== $user->store->id) {
                return $this->errorResponse('Unauthorized to delete this product', 403);
            }

            $this->productService->deleteProduct($id);
            return $this->successResponse(null, 'Product deleted');
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 400);
        }
    }
}

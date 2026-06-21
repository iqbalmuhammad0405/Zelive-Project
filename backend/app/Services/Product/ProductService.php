<?php
namespace App\Services\Product;
use App\Repositories\Interfaces\ProductRepositoryInterface;

class ProductService {
    protected $productRepo;
    public function __construct(ProductRepositoryInterface $productRepo) {
        $this->productRepo = $productRepo;
    }
    public function searchProducts(array $filters) {
        return $this->productRepo->search($filters);
    }
    public function createProduct(array $data) {
        return $this->productRepo->create($data);
    }
    public function getProductsByStore($storeId) {
        return $this->productRepo->getByStoreId($storeId);
    }
    public function getProductById($id) {
        return $this->productRepo->find($id);
    }
    public function updateProduct($id, array $data) {
        return $this->productRepo->update($id, $data);
    }
    public function deleteProduct($id) {
        return $this->productRepo->delete($id);
    }
}

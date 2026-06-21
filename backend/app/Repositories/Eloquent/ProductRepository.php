<?php
namespace App\Repositories\Eloquent;
use App\Repositories\Interfaces\ProductRepositoryInterface;
use App\Models\Product;

class ProductRepository extends BaseRepository implements ProductRepositoryInterface {
    public function __construct(Product $model) { parent::__construct($model); }
    public function search(array $filters) { 
        $query = $this->model->newQuery();
        if (isset($filters['keyword'])) {
            $query->where('name', 'like', '%' . $filters['keyword'] . '%');
        }
        if (isset($filters['category_id'])) {
            $query->where('category_id', $filters['category_id']);
        }
        return $query->paginate(20);
    }
    public function getByStoreId($storeId) {
        return $this->model->where('store_id', $storeId)->orderBy('created_at', 'desc')->get();
    }
}

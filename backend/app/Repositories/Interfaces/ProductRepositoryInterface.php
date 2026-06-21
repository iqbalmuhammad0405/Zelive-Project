<?php
namespace App\Repositories\Interfaces;
interface ProductRepositoryInterface extends BaseRepositoryInterface {
    public function search(array $filters);
    public function getByStoreId($storeId);
}

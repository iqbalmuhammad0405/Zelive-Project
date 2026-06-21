<?php
namespace App\Repositories\Eloquent;
use App\Repositories\Interfaces\AddressRepositoryInterface;
use App\Models\Address; // Note: We need to create this model later

class AddressRepository extends BaseRepository implements AddressRepositoryInterface {
    public function __construct(Address $model) { parent::__construct($model); }
    public function getUserAddresses($userId) { return $this->model->where('user_id', $userId)->get(); }
}

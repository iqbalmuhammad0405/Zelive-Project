<?php
namespace App\Repositories\Eloquent;
use App\Repositories\Interfaces\ProfileRepositoryInterface;
use App\Models\Profile;

class ProfileRepository extends BaseRepository implements ProfileRepositoryInterface {
    public function __construct(Profile $model) {
        parent::__construct($model);
    }
}

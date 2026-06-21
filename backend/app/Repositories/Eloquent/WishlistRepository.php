<?php
namespace App\Repositories\Eloquent;
use App\Repositories\Interfaces\WishlistRepositoryInterface;
use App\Models\Wishlist; // Note: We need to create this model later

class WishlistRepository extends BaseRepository implements WishlistRepositoryInterface {
    public function __construct(Wishlist $model) { parent::__construct($model); }
    public function getUserWishlist($userId) { return $this->model->where('user_id', $userId)->get(); }
}

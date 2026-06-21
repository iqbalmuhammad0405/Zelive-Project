<?php
namespace App\Repositories\Interfaces;
interface WishlistRepositoryInterface extends BaseRepositoryInterface {
    public function getUserWishlist($userId);
}

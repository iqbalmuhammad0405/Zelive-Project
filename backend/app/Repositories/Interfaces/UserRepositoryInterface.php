<?php
namespace App\Repositories\Interfaces;
interface UserRepositoryInterface extends BaseRepositoryInterface {
    public function findByEmail($email);
    public function attachRole($userId, $roleName);
}

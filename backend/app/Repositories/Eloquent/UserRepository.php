<?php
namespace App\Repositories\Eloquent;
use App\Repositories\Interfaces\UserRepositoryInterface;
use App\Models\User;
use App\Models\Role;

class UserRepository extends BaseRepository implements UserRepositoryInterface {
    public function __construct(User $model) {
        parent::__construct($model);
    }
    public function findByEmail($email) {
        return $this->model->where('email', $email)->first();
    }
    public function attachRole($userId, $roleName) {
        $user = $this->find($userId);
        $role = Role::where('name', $roleName)->first();
        if ($role) {
            $user->roles()->attach($role->id);
        }
    }
}

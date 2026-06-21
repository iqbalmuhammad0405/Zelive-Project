<?php
namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Tymon\JWTAuth\Contracts\JWTSubject;

class User extends Authenticatable implements JWTSubject {
    use Notifiable, HasUuids;

    protected $fillable = ['id', 'name', 'email', 'password'];
    protected $hidden = ['password', 'remember_token'];
    protected $casts = ['email_verified_at' => 'datetime'];

    public function roles() {
        return $this->belongsToMany(Role::class, 'user_roles');
    }

    public function profile() {
        return $this->hasOne(Profile::class);
    }

    public function store() {
        return $this->hasOne(Store::class);
    }

    public function wallet() {
        return $this->hasOne(Wallet::class);
    }

    public function cart() {
        return $this->hasOne(Cart::class);
    }

    public function hasRole($roleName) {
        return $this->roles()->where('name', $roleName)->exists();
    }

    public function getJWTIdentifier() {
        return $this->getKey();
    }

    public function getJWTCustomClaims() {
        return [];
    }
}

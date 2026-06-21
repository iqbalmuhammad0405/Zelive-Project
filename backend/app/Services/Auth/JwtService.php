<?php
namespace App\Services\Auth;
use Illuminate\Support\Str;

class JwtService {
    public function generateToken($user) {
        return auth('api')->login($user);
    }
    public function refreshToken($token) {
        return auth('api')->refresh();
    }
    public function invalidateToken($token) {
        return auth('api')->logout();
    }
}

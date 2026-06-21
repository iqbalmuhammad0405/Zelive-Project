<?php
namespace App\Http\Controllers\Api\V1\Auth;
use App\Http\Controllers\BaseController;
use App\Services\Auth\AuthService;
use App\Http\Requests\Auth\RegisterRequest;
use App\Http\Requests\Auth\RegisterSellerRequest;
use App\Http\Requests\Auth\LoginRequest;
use Illuminate\Http\Request;
use App\Http\Resources\UserResource;

class AuthController extends BaseController {
    protected $authService;

    public function __construct(AuthService $authService) {
        $this->authService = $authService;
    }

    public function register(RegisterRequest $request) {
        try {
            $result = $this->authService->registerBuyer($request->validated());
            return $this->successResponse([
                'user' => new UserResource($result['user']->load('profile', 'roles')),
                'token' => $result['token']
            ], 'Registration successful', 201);
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 400);
        }
    }

    public function registerSeller(RegisterSellerRequest $request) {
        try {
            $result = $this->authService->registerSeller($request->validated());
            return $this->successResponse([
                'user' => new UserResource($result['user']->load('profile', 'roles', 'store')),
                'token' => $result['token']
            ], 'Seller registration successful', 201);
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 400);
        }
    }

    public function login(LoginRequest $request) {
        try {
            $result = $this->authService->login($request->validated());
            return $this->successResponse([
                'user' => new UserResource($result['user']->load('profile', 'roles')),
                'token' => $result['token']
            ], 'Login successful');
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 401);
        }
    }

    public function googleLogin(Request $request) {
        $request->validate([
            'email' => 'required|email',
            'name' => 'required|string',
        ]);
        try {
            $user = $this->authService->googleLoginBypass($request->email, $request->name);
            if (isset($user['is_new_user']) && $user['is_new_user']) {
                return $this->successResponse([
                    'is_new_user' => true,
                    'email' => $user['email'],
                    'name' => $user['name']
                ], 'New Google user, registration required');
            }
            return $this->successResponse([
                'is_new_user' => false,
                'user' => new UserResource($user['user']->load('profile', 'roles')),
                'token' => $user['token']
            ], 'Google login successful');
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 401);
        }
    }

    public function googleRegister(Request $request) {
        $validated = $request->validate([
            'email' => 'required|email',
            'name' => 'required|string',
            'phone' => 'required|string',
            'role' => 'required|in:BUYER,SELLER',
            'store_name' => 'required_if:role,SELLER|nullable|string'
        ]);
        try {
            $result = $this->authService->googleRegister($validated);
            return $this->successResponse([
                'user' => new UserResource($result['user']->load('profile', 'roles')),
                'token' => $result['token']
            ], 'Google registration successful', 201);
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 400);
        }
    }

    public function logout(Request $request) {
        // Mock token invalidation
        return $this->successResponse(null, 'Logout successful');
    }
}

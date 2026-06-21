<?php
namespace App\Services\Auth;
use App\Repositories\Interfaces\UserRepositoryInterface;
use App\Repositories\Interfaces\ProfileRepositoryInterface;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;
use App\Models\Store;
use Illuminate\Support\Str;

class AuthService {
    protected $userRepo;
    protected $profileRepo;
    protected $jwtService;
    protected $firebaseService;

    public function __construct(
        UserRepositoryInterface $userRepo, 
        ProfileRepositoryInterface $profileRepo,
        JwtService $jwtService,
        FirebaseAuthService $firebaseService
    ) {
        $this->userRepo = $userRepo;
        $this->profileRepo = $profileRepo;
        $this->jwtService = $jwtService;
        $this->firebaseService = $firebaseService;
    }

    public function registerBuyer(array $data) {
        DB::beginTransaction();
        try {
            $data['password'] = Hash::make($data['password']);
            $data['id'] = Str::uuid()->toString();
            $user = $this->userRepo->create($data);
            $this->userRepo->attachRole($user->id, 'BUYER');
            
            $this->profileRepo->create([
                'user_id' => $user->id,
                'phone' => $data['phone']
            ]);
            DB::commit();
            
            $token = $this->jwtService->generateToken($user);
            return ['user' => $user, 'token' => $token];
        } catch (\Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }

    public function registerSeller(array $data) {
        DB::beginTransaction();
        try {
            $data['password'] = Hash::make($data['password']);
            $data['id'] = Str::uuid()->toString();
            $user = $this->userRepo->create($data);
            $this->userRepo->attachRole($user->id, 'SELLER');
            
            $this->profileRepo->create([
                'user_id' => $user->id,
                'phone' => $data['phone']
            ]);

            Store::create([
                'id' => Str::uuid()->toString(),
                'user_id' => $user->id,
                'name' => $data['store_name'],
                'status' => 'PENDING'
            ]);
            DB::commit();

            $token = $this->jwtService->generateToken($user);
            return ['user' => $user, 'token' => $token];
        } catch (\Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }

    public function login(array $credentials) {
        $user = $this->userRepo->findByEmail($credentials['email']);
        if (!$user || !Hash::check($credentials['password'], $user->password)) {
            throw new \Exception('Invalid credentials', 401);
        }
        
        $token = $this->jwtService->generateToken($user);
        return ['user' => $user, 'token' => $token];
    }

    public function googleLogin($firebaseToken) {
        $payload = $this->firebaseService->verifyToken($firebaseToken);
        return $this->googleLoginBypass($payload->email, $payload->name);
    }

    public function googleLoginBypass($email, $name) {
        $user = $this->userRepo->findByEmail($email);
        
        if (!$user) {
            return [
                'is_new_user' => true,
                'email' => $email,
                'name' => $name
            ];
        }

        $token = $this->jwtService->generateToken($user);
        return [
            'is_new_user' => false,
            'user' => $user,
            'token' => $token
        ];
    }

    public function googleRegister(array $data) {
        DB::beginTransaction();
        try {
            $user = $this->userRepo->create([
                'id' => Str::uuid()->toString(),
                'name' => $data['name'],
                'email' => $data['email'],
                'password' => Hash::make(Str::random(16))
            ]);
            $this->userRepo->attachRole($user->id, $data['role']);
            $this->profileRepo->create([
                'user_id' => $user->id,
                'phone' => $data['phone']
            ]);
            
            if ($data['role'] === 'SELLER') {
                Store::create([
                    'id' => Str::uuid()->toString(),
                    'user_id' => $user->id,
                    'name' => $data['store_name'],
                    'status' => 'PENDING'
                ]);
            }
            DB::commit();
            
            $token = $this->jwtService->generateToken($user);
            return ['user' => $user, 'token' => $token];
        } catch (\Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }
}

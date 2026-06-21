<?php
namespace Database\Seeders;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class UsersTableSeeder extends Seeder {
    public function run(): void {
        $adminId = Str::uuid()->toString();
        DB::table('users')->insert([
            'id' => $adminId,
            'name' => 'Admin Super',
            'email' => 'admin@zelive.com',
            'password' => Hash::make('password123'),
            'created_at' => now(),
            'updated_at' => now(),
        ]);
        
        $adminRole = DB::table('roles')->where('name', 'ADMIN')->first();
        DB::table('user_roles')->insert([
            'user_id' => $adminId,
            'role_id' => $adminRole->id,
        ]);
    }
}

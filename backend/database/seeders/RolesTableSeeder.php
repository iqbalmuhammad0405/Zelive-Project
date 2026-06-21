<?php
namespace Database\Seeders;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class RolesTableSeeder extends Seeder {
    public function run(): void {
        DB::table('roles')->insert([
            ['name' => 'ADMIN', 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'SELLER', 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'BUYER', 'created_at' => now(), 'updated_at' => now()],
        ]);
    }
}

<?php
namespace Database\Seeders;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class CategoriesTableSeeder extends Seeder {
    public function run(): void {
        DB::table('product_categories')->insert([
            ['name' => 'Electronics', 'slug' => 'electronics', 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Fashion', 'slug' => 'fashion', 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Beauty', 'slug' => 'beauty', 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Home & Living', 'slug' => 'home-living', 'created_at' => now(), 'updated_at' => now()],
        ]);
    }
}

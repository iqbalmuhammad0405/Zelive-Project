<?php
namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class ProductsTableSeeder extends Seeder {
    public function run(): void {
        $adminId = DB::table('users')->where('email', 'admin@zelive.com')->value('id');
        
        $storeId = Str::uuid()->toString();
        DB::table('stores')->insert([
            'id' => $storeId,
            'user_id' => $adminId,
            'name' => 'Official Zelive Store',
            'description' => 'The official store for Zelive merchandise',
            'status' => 'VERIFIED',
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        $categoryId = DB::table('product_categories')->first()->id;

        DB::table('products')->insert([
            [
                'id' => Str::uuid()->toString(),
                'store_id' => $storeId,
                'category_id' => $categoryId,
                'name' => 'Zelive Hoodie',
                'description' => 'Premium comfortable hoodie.',
                'price' => 350000,
                'stock' => 50,
                'status' => 'PUBLISHED',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id' => Str::uuid()->toString(),
                'store_id' => $storeId,
                'category_id' => $categoryId,
                'name' => 'Zelive T-Shirt',
                'description' => 'Cotton combed 30s t-shirt.',
                'price' => 150000,
                'stock' => 100,
                'status' => 'PUBLISHED',
                'created_at' => now(),
                'updated_at' => now(),
            ]
        ]);
    }
}

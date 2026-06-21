<?php
namespace Database\Factories;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class ProductFactory extends Factory {
    public function definition(): array {
        return [
            'id' => Str::uuid()->toString(),
            'name' => fake()->words(3, true),
            'description' => fake()->paragraph(),
            'price' => fake()->randomFloat(2, 10, 1000),
            'stock' => fake()->numberBetween(10, 100),
            'status' => 'PUBLISHED',
        ];
    }
}

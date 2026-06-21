<?php
namespace Database\Factories;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class StoreFactory extends Factory {
    public function definition(): array {
        return [
            'id' => Str::uuid()->toString(),
            'name' => fake()->company(),
            'description' => fake()->paragraph(),
            'status' => 'VERIFIED',
        ];
    }
}

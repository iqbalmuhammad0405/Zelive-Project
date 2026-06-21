<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        // Register Repositories
        $this->app->bind(
            \App\Repositories\Interfaces\UserRepositoryInterface::class,
            \App\Repositories\Eloquent\UserRepository::class
        );
        $this->app->bind(
            \App\Repositories\Interfaces\ProfileRepositoryInterface::class,
            \App\Repositories\Eloquent\ProfileRepository::class
        );
        $this->app->bind(
            \App\Repositories\Interfaces\AddressRepositoryInterface::class,
            \App\Repositories\Eloquent\AddressRepository::class
        );
        $this->app->bind(
            \App\Repositories\Interfaces\ProductRepositoryInterface::class,
            \App\Repositories\Eloquent\ProductRepository::class
        );
        $this->app->bind(
            \App\Repositories\Interfaces\WishlistRepositoryInterface::class,
            \App\Repositories\Eloquent\WishlistRepository::class
        );
    }

    public function boot(): void
    {
        //
    }
}

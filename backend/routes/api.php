<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

// Auth Routes
Route::post('auth/login', [\App\Http\Controllers\Api\V1\Auth\AuthController::class, 'login']);
Route::post('auth/register', [\App\Http\Controllers\Api\V1\Auth\AuthController::class, 'register']);
Route::post('auth/register-seller', [\App\Http\Controllers\Api\V1\Auth\AuthController::class, 'registerSeller']);
Route::post('auth/google', [\App\Http\Controllers\Api\V1\Auth\AuthController::class, 'googleLogin']);
Route::post('auth/google-register', [\App\Http\Controllers\Api\V1\Auth\AuthController::class, 'googleRegister']);

// Payment Webhooks
Route::post('webhook/midtrans', [\App\Http\Controllers\Api\V1\Finance\WalletController::class, 'midtransWebhook']);

// Public Routes
Route::get('categories', [\App\Http\Controllers\Api\V1\Product\CategoryController::class, 'index']);

// Protected Routes
Route::middleware('auth:api')->group(function () {
    // Buyer
    Route::get('buyer/dashboard', [\App\Http\Controllers\Api\V1\Buyer\BuyerDashboardController::class, 'index']);
    
    // Seller
    Route::get('seller/dashboard', [\App\Http\Controllers\Api\V1\Seller\SellerDashboardController::class, 'index']);
    Route::get('seller/products', [\App\Http\Controllers\Api\V1\Product\ProductController::class, 'getSellerProducts']);
    
    // Products & Categories
    Route::apiResource('products', \App\Http\Controllers\Api\V1\Product\ProductController::class);
    
    // Uploads
    Route::post('upload/avatar', [\App\Http\Controllers\Api\V1\UploadController::class, 'uploadAvatar']);
    Route::post('upload/product/{productId}', [\App\Http\Controllers\Api\V1\UploadController::class, 'uploadProductImage']);
    
    // Cart
    Route::apiResource('cart', \App\Http\Controllers\Api\V1\Checkout\CartController::class);
    
    // Checkout & Orders
    Route::post('checkout', [\App\Http\Controllers\Api\V1\Checkout\CheckoutController::class, 'process']);
    Route::get('orders', [\App\Http\Controllers\Api\V1\Checkout\OrderController::class, 'index']);
    Route::patch('orders/{id}/status', [\App\Http\Controllers\Api\V1\Checkout\OrderController::class, 'updateStatus']);
    
    // Realtime (Chat & Live)
    Route::post('chat/rooms', [\App\Http\Controllers\Api\V1\Realtime\ChatController::class, 'createRoom']);
    Route::post('chat/send', [\App\Http\Controllers\Api\V1\Realtime\ChatController::class, 'sendMessage']);
    Route::post('live/rooms', [\App\Http\Controllers\Api\V1\Realtime\LiveController::class, 'create']);
    Route::post('live/rooms/{id}/end', [\App\Http\Controllers\Api\V1\Realtime\LiveController::class, 'end']);
    Route::get('live/active', [\App\Http\Controllers\Api\V1\Realtime\LiveController::class, 'getActiveStreams']);
    Route::post('live/broadcast-peer', [\App\Http\Controllers\Api\V1\Realtime\LiveController::class, 'broadcastPeer']);
    
    // Wallet
    Route::get('wallet/balance', [\App\Http\Controllers\Api\V1\Finance\WalletController::class, 'getBalance']);
    Route::post('wallet/topup', [\App\Http\Controllers\Api\V1\Finance\WalletController::class, 'topup']);
    Route::get('wallet/transactions', [\App\Http\Controllers\Api\V1\Finance\WalletController::class, 'getTransactions']);

    // Profile
    Route::get('profile', [\App\Http\Controllers\Api\V1\ProfileController::class, 'show']);
    Route::put('profile', [\App\Http\Controllers\Api\V1\ProfileController::class, 'update']);
});

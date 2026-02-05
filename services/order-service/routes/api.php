<?php
// services/order-service/app/Http/Controllers/OrderController.php
namespace App\Http\Controllers;
use Illuminate\Http\Request;

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\Admin\AdminOrderController;
use App\Http\Middleware\AuthServiceMiddleware;

Route::middleware(AuthServiceMiddleware::class)->group(function () {
    Route::post('/orders/buy-now', [OrderController::class, 'buyNow']);
    Route::get('/orders',          [OrderController::class, 'index']);
    Route::post('/orders',         [OrderController::class, 'store']);

    //cart routes
    Route::post('/orders/from-cart', [OrderController::class, 'createFromCart']);

    // New route to get orders for the logged-in user
    Route::get('/orders/my', [OrderController::class, 'getMyOrders']);

    // get all orders for admin
    Route::get('/orders/all', [OrderController::class, 'getAllOrders']);
});

Route::get('/orders/dashboard', [OrderController::class, 'dashboard']);

// ADMIN ROUTES
Route::prefix('admin')->middleware(AuthServiceMiddleware::class)->group(function () {
    Route::get('orders', [AdminOrderController::class, 'index']);
    Route::get('orders/{id}', [AdminOrderController::class, 'show']);
    Route::patch('orders/{id}/status', [AdminOrderController::class, 'updateStatus']);
});

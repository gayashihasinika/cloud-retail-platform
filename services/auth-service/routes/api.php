<?php

// services/auth-service/routes/api.php
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\Admin\CustomerController;
use App\Http\Controllers\Admin\AdminDashboardController;

use Illuminate\Http\Request;

Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']);


// Protected routes (if any in auth service)
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', function (Request $request) {
        return $request->user();
    });
    // or /validate-token if your other service calls this
   Route::get('/validate-token', function (Request $request) {
    return $request->user();   // ← use the injected $request variable
})->middleware('auth:sanctum');   // or your auth middleware

// Other routes can be added here
// Admin routes for customer management
    Route::prefix('admin')->group(function () {
        Route::get('/customers', [CustomerController::class, 'index']);
        Route::patch('/customers/{id}/deactivate', [CustomerController::class, 'deactivate']);
        Route::patch('/customers/{id}/activate', [CustomerController::class, 'activate']);

// Admin dashboard route
        Route::get('/dashboard', [AdminDashboardController::class, 'index']);
    });
});
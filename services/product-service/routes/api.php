<?php
// services/product-service/routes/api.php
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ProductController;

// All API routes are now protected by 'api' middleware group (including auth_service)
Route::get('/products', [ProductController::class, 'index']);
Route::post('/products', [ProductController::class, 'store']);
Route::put('/products/{id}', [ProductController::class, 'update']);
Route::delete('/products/{id}', [ProductController::class, 'destroy']);

Route::get('/products/{id}', [ProductController::class, 'show']);
Route::patch('/products/{id}/stock', [ProductController::class, 'updateStock']);

Route::get('/products/count', [ProductController::class, 'count']);

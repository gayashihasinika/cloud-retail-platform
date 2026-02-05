<?php

use App\Http\Controllers\NotificationController;
use App\Http\Controllers\AdminActivityLogController;
use Illuminate\Support\Facades\Route;


Route::post('/notify', [NotificationController::class, 'notify']);

Route::prefix('admin')->middleware(AuthServiceMiddleware::class)->group(function () {
Route::post('/admin-activity-log', [AdminActivityLogController::class, 'store']);
Route::get('/admin-activity-log', [AdminActivityLogController::class, 'index']);
});
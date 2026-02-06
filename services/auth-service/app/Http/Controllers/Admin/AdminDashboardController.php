<?php

namespace App\Http\Controllers\Admin;
// services/auth-service/app/Http/Controllers/Admin/AdminDashboardController.php
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use App\Models\User;

const PRODUCT_API_URL = import.meta.env.VITE_PRODUCT_API_URL;

class AdminDashboardController extends Controller
{
    public function index()
    {
        try {
            // Product service
            
                $productsResponse = Http::timeout(5)->get(`${PRODUCT_API_URL}/api/products/count`);

            $totalProducts = $productsResponse->successful()
                ? ($productsResponse->json('count') ?? 0)
                : 0;

            // Order service
            $ordersResponse = Http::timeout(5)->get('http://order-service:8000/api/orders/dashboard');

            $ordersData = $ordersResponse->successful()
                ? ($ordersResponse->json() ?? [])
                : [];

            return response()->json([
                'total_products' => $totalProducts,
                'total_orders' => $ordersData['total_orders'] ?? 0,
                'today_orders' => $ordersData['today_orders'] ?? 0,
                'recent_orders' => $ordersData['recent_orders'] ?? [],

                'total_customers' => User::where('role', 'customer')->count(),
                'active_customers' => User::where('role', 'customer')
                    ->where('active', 1)->count(),
                'deactivated_customers' => User::where('role', 'customer')
                    ->where('active', 0)->count(),
            ]);
        } catch (\Throwable $e) {
            Log::error('Admin dashboard error', [
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);

            return response()->json([
                'message' => 'Server Error'
            ], 500);
        }
    }
}

<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use App\Models\User;

class AdminDashboardController extends Controller
{
    private $productServiceUrl;
    private $orderServiceUrl;

    public function __construct()
    {
        $this->productServiceUrl = env('PRODUCT_SERVICE_URL', 'http://product-service:8001');
        $this->orderServiceUrl = env('ORDER_SERVICE_URL', 'http://order-service:8002');
    }

    public function index()
    {
        try {
            $productsResponse = Http::timeout(5)->get($this->productServiceUrl . '/api/products/count');

            $totalProducts = $productsResponse->successful()
                ? ($productsResponse->json('count') ?? 0)
                : 0;

            $ordersResponse = Http::timeout(5)->get($this->orderServiceUrl . '/api/orders/dashboard');

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
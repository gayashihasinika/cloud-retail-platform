<?php

// services/order-service/app/Http/Controllers/OrderController.php
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use App\Models\Order;
use App\Models\OrderItem;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;



class OrderController extends Controller
{
    $PRODUCT_API_URL = env('APP_URL', 'http://13.218.85.103');

public function createFromCart(Request $request)
{
    $request->validate([
        'items' => 'required|array|min:1',
        'items.*.product_id' => 'required|integer|exists:product_db.products,id',
        'items.*.quantity' => 'required|integer|min:1',
        'items.*.price' => 'required|numeric|min:0',
        'total_amount' => 'required|numeric|min:0',
    ]);

    $user = $request->user();
    if (!$user) {
        return response()->json(['message' => 'Unauthenticated'], 401);
    }

    return DB::transaction(function () use ($request, $user) {
        $order = Order::create([
            'customer_id'     => $user->id,
            'total_amount'    => $request->total_amount,
            'status'          => 'pending',
            'shipping_address' => json_encode($request->shipping_address),
        ]);

        foreach ($request->items as $item) {
            OrderItem::create([
                'order_id'   => $order->id,
                'product_id' => $item['product_id'],
                'quantity'   => $item['quantity'],
                'price'      => $item['price'],
            ]);

            // Decrease stock
            Http::patch(`${PRODUCT_API_URL}/api/products/{$item['product_id']}/stock`, [
                'quantity'  => $item['quantity'],
                'operation' => 'decrease',
            ]);
        }

        return response()->json([
            'message'   => 'Order created successfully',
            'order_id'  => $order->id,
        ], 201);
    });
}

 public function getMyOrders(Request $request)
{
    $user = $request->user();

    if (!$user) {
        return response()->json(['message' => 'Unauthorized'], 401);
    }

    try {
        $orders = Order::where('customer_id', $user->id)
            ->orderBy('created_at', 'desc')
            ->with('orderItems')
            ->get();

        $formattedOrders = $orders->map(function ($order) {

            $products = $order->orderItems->map(function ($item) {

                try {
                    $response = Http::timeout(3)
                        ->get(`${PRODUCT_API_URL}/api/products/{$item->product_id}`);

                    if (!$response->successful()) {
                        Log::warning('Product service failed', [
                            'product_id' => $item->product_id
                        ]);
                        return [
                            'id' => $item->product_id,
                            'name' => 'Unknown Product'
                        ];
                    }

                    $data = $response->json();

                  return [
                        'id' => $item->product_id,
                        'name' => $data['data']['name'] ?? $data['name'] ?? 'Unknown Product'
                    ];

                } catch (\Exception $e) {
                    Log::error('Product fetch error', [
                        'product_id' => $item->product_id,
                        'error' => $e->getMessage()
                    ]);

                    return [
                        'id' => $item->product_id,
                        'name' => 'Unknown Product'
                    ];
                }
            });

            return [
                'id'           => $order->id,
                'total_amount' => $order->total_amount,
                'created_at'   => $order->created_at,
                'products'     => $products,
            ];
        });

        return response()->json($formattedOrders, 200);

    } catch (\Exception $e) {
        Log::error('Error fetching user orders', [
            'error' => $e->getMessage()
        ]);
        return response()->json(['message' => 'Internal Server Error'], 500);
    }
}

public function getAllOrders()
{
    try {
        $orders = Order::with('orderItems')
            ->orderBy('created_at', 'desc')
            ->get();

        $formattedOrders = $orders->map(function ($order) {

            $products = $order->orderItems->map(function ($item) {

                try {
                    $response = Http::timeout(3)
                        ->get(`${PRODUCT_API_URL}/api/products/{$item->product_id}`);

                    if (!$response->successful()) {
                        Log::warning('Product service failed', [
                            'product_id' => $item->product_id,
                            'status' => $response->status()
                        ]);

                        return [
                            'id' => $item->product_id,
                            'name' => 'Unknown Product',
                            'quantity' => $item->quantity
                        ];
                    }

                    $data = $response->json();

                    return [
                        'id' => $item->product_id,
                        'name' => $data['data']['name']
                                  ?? $data['name']
                                  ?? 'Unknown Product',
                        'quantity' => $item->quantity
                    ];

                } catch (\Exception $e) {
                    Log::error('Product fetch error', [
                        'product_id' => $item->product_id,
                        'error' => $e->getMessage()
                    ]);

                    return [
                        'id' => $item->product_id,
                        'name' => 'Unknown Product',
                        'quantity' => $item->quantity
                    ];
                }
            });

            return [
                'id'           => $order->id,
                'customer_id'  => $order->customer_id,
                'total_amount' => $order->total_amount,
                'status'       => $order->status,
                'created_at'   => $order->created_at,
                'products'     => $products
            ];
        });

        return response()->json($formattedOrders, 200);

    } catch (\Exception $e) {
        Log::error('Admin order fetch failed', [
            'error' => $e->getMessage()
        ]);

        return response()->json(['message' => 'Server Error'], 500);
    }
}

public function dashboard()
{
    return response()->json([
        'total_orders' => \App\Models\Order::count(),
        'today_orders' => \App\Models\Order::whereDate('created_at', today())->count(),
        'recent_orders' => \App\Models\Order::latest()->limit(5)->get()
    ]);
}

}
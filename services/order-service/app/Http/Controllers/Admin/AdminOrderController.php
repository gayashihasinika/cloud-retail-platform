<?php

// services/order-service/app/Http/Controllers/Admin/AdminOrderController.php
namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Order;
use Illuminate\Support\Facades\Log;

class AdminOrderController extends Controller
{
    // Update order status
    public function updateStatus(Request $request, $id)
    {
        $request->validate([
            'status' => 'required|in:pending,processing,shipped,completed,cancelled'
        ]);

        try {
            $order = Order::findOrFail($id);
            $order->status = $request->status;
            $order->save();

            return response()->json([
                'message' => 'Order status updated',
                'order' => $order
            ]);
        } catch (\Throwable $e) {
            Log::error('Order status update error', [
                'message' => $e->getMessage()
            ]);
            return response()->json(['message' => 'Server Error'], 500);
        }
    }

    // Get all orders for admin
    public function index()
    {
        $orders = Order::with('items')->orderBy('created_at','desc')->get();
        return response()->json($orders);
    }

    // Get order details
    public function show($id)
    {
        $order = Order::with('items')->findOrFail($id);
        return response()->json($order);
    }
}

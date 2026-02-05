<?php

// services/auth-service/app/Http/Controllers/Admin/CustomerController.php
namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Http;


class CustomerController extends Controller
{
    // List all customers
    public function index()
    {
        try {
            $customers = User::where('role', 'customer')
                ->select('id', 'name', 'email', 'created_at', 'active')
                ->get();

            return response()->json($customers, 200);
        } catch (\Exception $e) {
            Log::error('Fetch customers failed: ' . $e->getMessage());
            return response()->json(['message' => 'Server Error'], 500);
        }
    }

    // Deactivate customer
    public function deactivate($id)
{
    try {
        $customer = User::where('role', 'customer')->findOrFail($id);
        $customer->active = 0;
        $customer->save();

        // Notify admin activity log service
        try {
            Http::post('http://notification-service/api/admin-activity-log', [
                'admin_id'    => auth()->id(),
                'admin_name'  => auth()->user()->name,
                'action'      => 'deactivated customer',
                'entity_type' => 'customer',
                'entity_id'   => $customer->id,
            ]);
        } catch (\Exception $e) {
            Log::error('Failed to log customer deactivation', ['error' => $e->getMessage()]);
        }

        return response()->json(['message' => 'Customer deactivated'], 200);
    } catch (\Exception $e) {
        Log::error('Deactivate failed: ' . $e->getMessage());
        return response()->json(['message' => 'Server Error'], 500);
    }
}


    // ✅ Activate customer
   public function activate($id)
{
    try {
        $customer = User::where('role', 'customer')->findOrFail($id);
        $customer->active = 1;
        $customer->save();

        // Notify admin activity log service
        try {
            Http::post('http://notification-service/api/admin-activity-log', [
                'admin_id'    => auth()->id(),
                'admin_name'  => auth()->user()->name,
                'action'      => 'activated customer',
                'entity_type' => 'customer',
                'entity_id'   => $customer->id,
            ]);
        } catch (\Exception $e) {
            Log::error('Failed to log customer activation', ['error' => $e->getMessage()]);
        }

        return response()->json(['message' => 'Customer activated'], 200);
    } catch (\Exception $e) {
        Log::error('Activate failed: ' . $e->getMessage());
        return response()->json(['message' => 'Server Error'], 500);
    }
}

}

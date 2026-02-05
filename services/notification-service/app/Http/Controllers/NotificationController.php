<?php

namespace App\Http\Controllers;
// services/notification-service/app/Http/Controllers/NotificationController.php
use Illuminate\Http\Request;
use App\Models\Notification;

class NotificationController extends Controller
{
    // Receive notification from order-service
    public function notify(Request $request)
    {
        $request->validate([
            'type' => 'required|string',
            'data' => 'required|array',
        ]);

        $notification = Notification::create([
            'type' => $request->type,
            'data' => json_encode($request->data),
        ]);

        // Simulate sending email/log
        \Log::info("Notification triggered:", $request->all());

        return response()->json([
            'message' => 'Notification logged',
            'notification' => $notification
        ]);
    }
}

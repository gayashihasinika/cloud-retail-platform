<?php

// services/notification-service/app/Http/Controllers/AdminActivityLogController.php
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\AdminActivityLog;

class AdminActivityLogController extends Controller
{
    public function store(Request $request)
    {
        AdminActivityLog::create($request->all());

        return response()->json([
            'message' => 'Activity logged successfully'
        ]);
    }

    public function index()
    {
        return AdminActivityLog::latest()->get();
    }
}

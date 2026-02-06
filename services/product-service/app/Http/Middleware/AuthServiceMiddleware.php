<?php

namespace App\Http\Middleware;
// services/product-service/app/Http/Middleware/AuthServiceMiddleware.php
use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class AuthServiceMiddleware
{
    public function handle(Request $request, Closure $next)
    {
        // Handle OPTIONS preflight here too (for simplicity)
        if ($request->getMethod() === 'OPTIONS') {
            return response()->noContent(204)
                ->header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
                ->header('Access-Control-Allow-Headers', 'Authorization, Content-Type');
        }

        $token = $request->bearerToken();

        if (!$token) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        $authServiceUrl = env('AUTH_SERVICE_URL', 'http://13.218.85.103:8000');

        $response = Http::withHeaders([
            'Authorization' => "Bearer {$token}",
            'Accept' => 'application/json'
        ])->get("{$authServiceUrl}/api/validate-token");  // Use consistent endpoint

        if ($response->failed()) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        $request->merge(['user' => $response->json()]);

        return $next($request);
    }
}
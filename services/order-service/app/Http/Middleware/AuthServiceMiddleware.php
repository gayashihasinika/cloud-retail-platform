<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Symfony\Component\HttpFoundation\Response;

class AuthServiceMiddleware
{
    public function handle(Request $request, Closure $next): Response
    {
        if ($request->isMethod('OPTIONS')) {
            return response()->noContent(204)
                ->header('Access-Control-Allow-Origin', '*')
                ->header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
                ->header('Access-Control-Allow-Headers', 'Authorization, Content-Type, Accept');
        }

        $token = $request->bearerToken();

        if (!$token) {
            Log::warning('No token in request');
            return response()->json(['message' => 'Unauthorized - No token'], 401);
        }

        $authUrl = env('AUTH_SERVICE_URL', 'http://auth-service:8000') . '/api/validate-token';

        Log::info('Validating token', ['url' => $authUrl]);

        try {
            $response = Http::withHeaders([
                'Authorization' => "Bearer $token",
                'Accept' => 'application/json',
            ])->timeout(10)->get($authUrl);

            if ($response->successful()) {
                $userData = $response->json();
                Log::info('Token valid', ['user' => $userData]);
                $request->setUserResolver(function () use ($userData) {
                    return (object) $userData;
                });
            } else {
                Log::error('Token invalid', ['status' => $response->status()]);
                return response()->json(['message' => 'Unauthorized - Invalid token'], 401);
            }
        } catch (\Exception $e) {
            Log::error('Auth service error', ['error' => $e->getMessage()]);
            return response()->json(['message' => 'Auth service unavailable'], 503);
        }

        return $next($request);
    }
}

<?php
namespace App\Http\Middleware;
use Closure;
use Illuminate\Http\Request;

class JwtMiddleware {
    public function handle(Request $request, Closure $next) {
        $token = $request->bearerToken();
        if (!$token) {
            return response()->json(['status' => 'Error', 'message' => 'Token not provided'], 401);
        }
        // Mock validation
        return $next($request);
    }
}

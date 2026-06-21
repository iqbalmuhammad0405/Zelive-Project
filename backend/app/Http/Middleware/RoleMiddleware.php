<?php
namespace App\Http\Middleware;
use Closure;
use Illuminate\Http\Request;

class RoleMiddleware {
    public function handle(Request $request, Closure $next, ...$roles) {
        // Mock role check since auth is mocked
        // In real app: if (!auth()->user()->hasAnyRole($roles)) throw Exception
        return $next($request);
    }
}

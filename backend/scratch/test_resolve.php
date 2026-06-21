<?php
// Load Laravel
require __DIR__ . '/../vendor/autoload.php';
$app = require_once __DIR__ . '/../bootstrap/app.php';

// Bootstrap the application kernel so that routing and configuration are loaded
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use Illuminate\Support\Facades\Route;

echo "--- Resolving Controller Dependencies ---\n";
$hasFailure = false;

foreach (Route::getRoutes() as $route) {
    $action = $route->getAction();
    if (isset($action['controller'])) {
        $controllerParts = explode('@', $action['controller']);
        $controller = $controllerParts[0];
        
        // Skip framework-internal controllers or packages (Ignition, Sanctum)
        if (strpos($controller, 'Spatie\\') !== false || strpos($controller, 'Laravel\\') !== false || strpos($controller, 'Illuminate\\') !== false) {
            continue;
        }

        try {
            $instance = $app->make($controller);
            echo "✅ Resolved: $controller\n";
        } catch (\Exception $e) {
            echo "❌ FAILED: $controller\n   Reason: " . $e->getMessage() . "\n";
            $hasFailure = true;
        }
    }
}

if ($hasFailure) {
    exit(1);
} else {
    echo "--- All application controllers resolved successfully! ---\n";
    exit(0);
}

<?php
namespace App\Services\Seller;
use App\Models\Product;
use App\Models\Order;
use Carbon\Carbon;

class SellerService {
    public function getDashboardData($storeId) {
        $productsCount = Product::where('store_id', $storeId)->count();
        $ordersCount = Order::where('store_id', $storeId)->count();
        $recentOrders = Order::where('store_id', $storeId)
            ->with(['items.product', 'user'])
            ->orderBy('created_at', 'desc')
            ->limit(5)
            ->get();
            
        // Calculate revenue
        $revenueToday = Order::where('store_id', $storeId)
            ->whereDate('created_at', Carbon::today())
            ->sum('total_amount');
            
        $revenueWeekly = Order::where('store_id', $storeId)
            ->where('created_at', '>=', Carbon::now()->subDays(7))
            ->sum('total_amount');
            
        $revenueMonthly = Order::where('store_id', $storeId)
            ->where('created_at', '>=', Carbon::now()->subDays(30))
            ->sum('total_amount');

        return [
            'revenue_today' => (float) $revenueToday,
            'revenue_weekly' => (float) $revenueWeekly,
            'revenue_monthly' => (float) $revenueMonthly,
            'orders_count' => $ordersCount,
            'products_count' => $productsCount,
            'followers_count' => 0, // Mock for followers
            'recent_orders' => $recentOrders
        ];
    }
}

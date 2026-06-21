<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class Order extends Model {
    use HasUuids;
    
    protected $fillable = [
        'id', 'user_id', 'store_id', 'total_amount', 'shipping_cost', 'status'
    ];

    public function user() {
        return $this->belongsTo(User::class);
    }

    public function store() {
        return $this->belongsTo(Store::class);
    }

    public function items() {
        return $this->hasMany(OrderItem::class);
    }
}

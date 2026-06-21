<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class Product extends Model {
    use HasUuids;
    
    protected $fillable = [
        'id', 'store_id', 'category_id', 'name', 'description', 
        'price', 'discount', 'stock', 'weight', 'status'
    ];

    protected $appends = ['image_url'];

    public function getImageUrlAttribute() {
        if ($this->relationLoaded('images') && $this->images->isNotEmpty()) {
            $imagePath = $this->images->first()->image_path;
            
            if (str_starts_with($imagePath, 'http')) {
                if (str_contains($imagePath, '/storage/')) {
                    $parts = explode('/storage/', $imagePath);
                    return '/storage/' . end($parts);
                }
                return $imagePath;
            }
            
            return '/storage/' . $imagePath;
        }
        return null;
    }

    public function store() {
        return $this->belongsTo(Store::class);
    }

    public function category() {
        return $this->belongsTo(ProductCategory::class, 'category_id');
    }

    public function images() {
        return $this->hasMany(ProductImage::class);
    }

    public function orderItems() {
        return $this->hasMany(OrderItem::class);
    }
}

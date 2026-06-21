<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class LiveRoom extends Model {
    use HasUuids;
    
    protected $fillable = [
        'id', 'store_id', 'title', 'status', 'viewer_count', 'total_likes', 'started_at', 'ended_at'
    ];

    protected $casts = [
        'started_at' => 'datetime',
        'ended_at' => 'datetime',
    ];

    public function store() {
        return $this->belongsTo(Store::class);
    }
}

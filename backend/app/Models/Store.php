<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class Store extends Model {
    use HasUuids;
    protected $fillable = ['id', 'user_id', 'name', 'description', 'logo', 'banner', 'status'];

    public function user() {
        return $this->belongsTo(User::class);
    }
}

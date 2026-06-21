<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class WalletTransaction extends Model {
    use HasUuids;
    
    protected $fillable = [
        'id', 'wallet_id', 'type', 'amount', 'balance_after', 'reference_id', 'description', 'status'
    ];

    public function wallet() {
        return $this->belongsTo(Wallet::class);
    }
}

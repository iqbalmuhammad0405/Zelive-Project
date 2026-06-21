<?php
namespace App\Services\Finance;
use Illuminate\Support\Facades\DB;
use App\Models\Wallet;
use App\Models\WalletTransaction;
use Illuminate\Support\Str;

class WalletService {
    public function topUp($userId, $amount) {
        $wallet = Wallet::firstOrCreate(['user_id' => $userId], ['id' => Str::uuid()->toString(), 'balance' => 0]);
        
        $transactionId = Str::uuid()->toString();
        $transaction = WalletTransaction::create([
            'id' => $transactionId,
            'wallet_id' => $wallet->id,
            'amount' => $amount,
            'balance_after' => $wallet->balance,
            'type' => 'TOPUP',
            'status' => 'PENDING'
        ]);

        \Midtrans\Config::$serverKey = config('midtrans.server_key');
        \Midtrans\Config::$isProduction = config('midtrans.is_production');
        \Midtrans\Config::$isSanitized = config('midtrans.is_sanitized');
        \Midtrans\Config::$is3ds = config('midtrans.is_3ds');

        $params = [
            'transaction_details' => [
                'order_id' => $transactionId,
                'gross_amount' => $amount,
            ],
            'customer_details' => [
                'first_name' => auth('api')->user()->name ?? 'User',
                'email' => auth('api')->user()->email ?? 'user@zelive.com',
            ]
        ];

        try {
            $snapToken = \Midtrans\Snap::getSnapToken($params);
            return [
                'transaction' => $transaction,
                'snap_token' => $snapToken
            ];
        } catch (\Exception $e) {
            throw new \Exception("Failed to generate payment token: " . $e->getMessage());
        }
    }

    public function withdraw($userId, $amount, $bankDetails) {
        return DB::transaction(function () use ($userId, $amount, $bankDetails) {
            $wallet = Wallet::where('user_id', $userId)->lockForUpdate()->firstOrFail();
            if ($wallet->balance < $amount) throw new \Exception("Insufficient balance");
            
            $wallet->balance -= $amount;
            $wallet->save();
            return true;
        });
    }

    public function getBalance($userId) { 
        return Wallet::where('user_id', $userId)->value('balance') ?? 0; 
    }

    public function getTransactions($userId) {
        $wallet = Wallet::where('user_id', $userId)->first();
        if (!$wallet) return [];
        return WalletTransaction::where('wallet_id', $wallet->id)
            ->orderBy('created_at', 'desc')
            ->get();
    }
}

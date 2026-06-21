<?php
namespace App\Http\Controllers\Api\V1\Finance;
use App\Http\Controllers\BaseController;
use App\Services\Finance\WalletService;
use Illuminate\Http\Request;

class WalletController extends BaseController {
    protected $walletService;
    public function __construct(WalletService $walletService) { $this->walletService = $walletService; }
    public function getBalance() { 
        $userId = auth('api')->id();
        return $this->successResponse(['balance' => $this->walletService->getBalance($userId)], 'Wallet balance'); 
    }
    
    public function topup(Request $request) { 
        $request->validate(['amount' => 'required|numeric|min:10000']);
        try {
            $userId = auth('api')->id();
            $result = $this->walletService->topUp($userId, $request->amount);
            return $this->successResponse($result, 'Topup initiated'); 
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage());
        }
    }
    public function getTransactions() {
        $userId = auth('api')->id();
        return $this->successResponse($this->walletService->getTransactions($userId), 'Wallet transactions');
    }
    public function midtransWebhook(Request $request) {
        $notif = new \Midtrans\Notification();
        $transactionId = $notif->order_id;
        $transactionStatus = $notif->transaction_status;
        
        $walletTransaction = \App\Models\WalletTransaction::find($transactionId);
        if (!$walletTransaction) return response()->json(['message' => 'Transaction not found'], 404);

        if ($transactionStatus == 'capture' || $transactionStatus == 'settlement') {
            if ($walletTransaction->status == 'PENDING') {
                $wallet = \App\Models\Wallet::find($walletTransaction->wallet_id);
                $wallet->increment('balance', $walletTransaction->amount);
                
                $walletTransaction->update([
                    'status' => 'COMPLETED',
                    'balance_after' => $wallet->balance
                ]);
            }
        } else if ($transactionStatus == 'cancel' || $transactionStatus == 'deny' || $transactionStatus == 'expire') {
            $walletTransaction->update(['status' => 'FAILED']);
        }
        
        return response()->json(['message' => 'OK']);
    }
}

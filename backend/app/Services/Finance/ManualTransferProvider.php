<?php
namespace App\Services\Finance;

class ManualTransferProvider implements PaymentProviderInterface {
    public function createCharge($orderId, $amount) { return 'manual_tx_'.uniqid(); }
    public function verifyPayment($transactionId) { return true; }
}

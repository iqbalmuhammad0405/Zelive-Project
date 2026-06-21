<?php
namespace App\Services\Finance;

interface PaymentProviderInterface {
    public function createCharge($orderId, $amount);
    public function verifyPayment($transactionId);
}

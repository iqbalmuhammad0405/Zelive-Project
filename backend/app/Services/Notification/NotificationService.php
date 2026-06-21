<?php
namespace App\Services\Notification;

class NotificationService {
    protected $fcmService;
    public function __construct(FcmService $fcmService) { $this->fcmService = $fcmService; }
    public function notifyOrderPaid($userId, $orderId) { return $this->fcmService->sendPushNotification('token', 'Order Paid', 'Order has been paid'); }
}

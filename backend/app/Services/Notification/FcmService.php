<?php
namespace App\Services\Notification;

class FcmService {
    // Mock Firebase Cloud Messaging
    public function sendPushNotification($deviceToken, $title, $body) { return true; }
}

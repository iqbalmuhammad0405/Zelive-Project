<?php
namespace App\Services\Realtime;

class FirestoreService {
    // Mock Firebase Admin SDK for Firestore
    public function createChatRoom($buyerId, $sellerId) {
        return 'firestore_room_' . uniqid();
    }
    public function sendSystemMessage($roomId, $message) { return true; }
}

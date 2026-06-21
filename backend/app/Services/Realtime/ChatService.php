<?php
namespace App\Services\Realtime;

class ChatService {
    protected $firestore;
    public function __construct(FirestoreService $firestore) { $this->firestore = $firestore; }
    public function initializeRoom($buyerId, $sellerId) {
        return $this->firestore->createChatRoom($buyerId, $sellerId);
    }
}

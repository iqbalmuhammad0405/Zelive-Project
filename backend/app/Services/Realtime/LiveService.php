<?php
namespace App\Services\Realtime;
use App\Models\LiveRoom;

class LiveService {
    public function createLiveRoom($storeId, $title) {
        return LiveRoom::create([
            'store_id' => $storeId,
            'title' => $title,
            'status' => 'WAITING'
        ]);
    }
    public function updateStatus($roomId, $status) {
        $room = LiveRoom::find($roomId);
        if ($room) {
            $room->status = $status;
            if ($status === 'LIVE') $room->started_at = now();
            if ($status === 'ENDED') $room->ended_at = now();
            $room->save();
            return $room;
        }
        return null;
    }
}

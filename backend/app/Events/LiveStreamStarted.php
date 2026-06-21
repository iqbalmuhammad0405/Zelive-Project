<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class LiveStreamStarted implements ShouldBroadcastNow
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $roomId;
    public $peerId;

    /**
     * Create a new event instance.
     */
    public function __construct($roomId, $peerId)
    {
        $this->roomId = $roomId;
        $this->peerId = $peerId;
    }

    /**
     * Get the channels the event should broadcast on.
     *
     * @return array<int, \Illuminate\Broadcasting\Channel>
     */
    public function broadcastOn(): array
    {
        return [
            new Channel('live-chat.' . $this->roomId),
        ];
    }

    public function broadcastWith()
    {
        return [
            'peerId' => $this->peerId,
            'type' => 'STREAM_STARTED'
        ];
    }
}

<?php
namespace App\Http\Controllers\Api\V1\Realtime;
use App\Http\Controllers\BaseController;
use App\Services\Realtime\LiveService;
use Illuminate\Http\Request;

class LiveController extends BaseController {
    protected $liveService;
    public function __construct(LiveService $liveService) { $this->liveService = $liveService; }
    public function create(Request $request) { 
        $user = auth('api')->user();
        if (!$user->store) return $this->errorResponse('Only sellers can start live', 403);
        return $this->successResponse($this->liveService->createLiveRoom($user->store->id, $request->title ?? 'Live Sale'), 'Live room created'); 
    }
    public function start($id) { 
        return $this->successResponse($this->liveService->updateStatus($id, 'LIVE'), 'Live started'); 
    }
    public function end($id) { 
        return $this->successResponse($this->liveService->updateStatus($id, 'ENDED'), 'Live ended'); 
    }

    public function getActiveStreams() {
        $activeRooms = \App\Models\LiveRoom::where('status', 'LIVE')->with('store')->get();
        return $this->successResponse($activeRooms, 'Active live streams');
    }

    public function broadcastPeer(Request $request) {
        $request->validate([
            'room_id' => 'required|string',
            'peer_id' => 'required|string'
        ]);

        event(new \App\Events\LiveStreamStarted($request->room_id, $request->peer_id));
        return $this->successResponse(null, 'Peer ID broadcasted');
    }
}

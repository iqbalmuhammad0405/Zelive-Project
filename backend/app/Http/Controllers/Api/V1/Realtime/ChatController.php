<?php
namespace App\Http\Controllers\Api\V1\Realtime;
use App\Http\Controllers\BaseController;
use App\Services\Realtime\ChatService;
use Illuminate\Http\Request;

class ChatController extends BaseController {
    protected $chatService;
    public function __construct(ChatService $chatService) { $this->chatService = $chatService; }
    public function createRoom(Request $request) { return $this->successResponse($this->chatService->initializeRoom(1, 2), 'Room created'); }
    public function blockUser(Request $request) { return $this->successResponse(null, 'User blocked'); }

    public function sendMessage(Request $request) {
        $request->validate([
            'room_id' => 'required|string',
            'message' => 'required|string|max:500'
        ]);

        $user = auth('api')->user();
        
        event(new \App\Events\LiveChatMessageSent(
            $request->room_id, 
            $request->message, 
            ['id' => $user->id, 'name' => $user->name]
        ));

        return $this->successResponse(null, 'Message sent');
    }
}

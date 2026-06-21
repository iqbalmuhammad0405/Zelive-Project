<?php
namespace App\Http\Controllers\Api\V1\Notification;
use App\Http\Controllers\BaseController;
use Illuminate\Http\Request;

class NotificationController extends BaseController {
    public function index() { return $this->successResponse([], 'Notifications retrieved'); }
    public function readAll() { return $this->successResponse(null, 'Marked all as read'); }
}

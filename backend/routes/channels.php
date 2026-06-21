<?php

use Illuminate\Support\Facades\Broadcast;

Broadcast::channel('App.Models.User.{id}', function ($user, $id) {
    return (int) $user->id === (int) $id;
});

Broadcast::channel('presence-live-room.{roomId}', function ($user, $roomId) {
    // For a presence channel, returning an array of user data authorizes them
    // and makes this data available to all clients in the room.
    return [
        'id' => $user->id,
        'name' => $user->name,
    ];
});

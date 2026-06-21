<?php
namespace App\Http\Resources;
use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource {
    public function toArray($request) {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'email' => $this->email,
            'roles' => $this->roles->map(fn($role) => ['name' => $role->name]),
            'profile' => new ProfileResource($this->whenLoaded('profile')),
            'store' => $this->whenLoaded('store'),
        ];
    }
}

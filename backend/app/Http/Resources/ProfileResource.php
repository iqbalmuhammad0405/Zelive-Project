<?php
namespace App\Http\Resources;
use Illuminate\Http\Resources\Json\JsonResource;

class ProfileResource extends JsonResource {
    public function toArray($request) {
        return [
            'phone' => $this->phone,
            'avatar' => $this->avatar,
            'bio' => $this->bio,
            'gender' => $this->gender,
            'birth_date' => $this->birth_date,
        ];
    }
}

<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\BaseController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use App\Models\Profile;

class ProfileController extends BaseController
{
    public function show()
    {
        $user = auth()->user()->load(['profile', 'store', 'wallet']);
        return $this->successResponse($user, 'User profile retrieved successfully');
    }

    public function update(Request $request)
    {
        $user = auth()->user();

        $request->validate([
            'name' => 'sometimes|string|max:255',
            'phone' => 'sometimes|string|max:20',
            'bio' => 'sometimes|string|max:1000',
            'gender' => 'sometimes|in:MALE,FEMALE,OTHER',
            'birth_date' => 'sometimes|date',
            'password' => 'sometimes|string|min:6'
        ]);

        if ($request->has('name')) {
            $user->name = $request->name;
        }

        if ($request->has('password') && $request->password) {
            $user->password = Hash::make($request->password);
        }
        
        $user->save();

        $profileData = $request->only(['phone', 'bio', 'gender', 'birth_date']);
        
        if (!empty($profileData)) {
            $profile = $user->profile;
            if (!$profile) {
                $profile = new Profile();
                $profile->user_id = $user->id;
            }
            $profile->fill($profileData);
            $profile->save();
        }

        return $this->successResponse($user->load('profile'), 'Profile updated successfully');
    }
}

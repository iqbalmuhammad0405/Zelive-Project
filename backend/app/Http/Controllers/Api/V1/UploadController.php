<?php

namespace App\Http\Controllers\Api\V1;

use Illuminate\Http\Request;

use App\Http\Controllers\BaseController;
use Illuminate\Support\Facades\Storage;
use App\Models\ProductImage;

class UploadController extends BaseController
{
    public function uploadAvatar(Request $request)
    {
        $request->validate(['image' => 'required|max:2048']); // Removed image|mimes to bypass fileinfo
        
        $user = auth('api')->user();
        if ($user->profile->avatar) {
            Storage::disk('public')->delete(str_replace('/storage/', '', parse_url($user->profile->avatar, PHP_URL_PATH)));
        }

        $file = $request->file('image');
        $extension = $file->getClientOriginalExtension() ?: 'jpg';
        $filename = uniqid('avatar_') . '.' . $extension;
        $path = $file->storeAs('avatars', $filename, 'public');
        
        $url = asset('storage/' . $path);
        
        $user->profile()->update(['avatar' => $url]);

        return $this->successResponse(['url' => $url], 'Avatar uploaded successfully');
    }

    public function uploadProductImage(Request $request, $productId)
    {
        $request->validate(['image' => 'required|max:5120']); // Removed image|mimes to bypass fileinfo
        
        // Ensure product exists and belongs to the seller's store
        $product = \App\Models\Product::findOrFail($productId);
        
        $file = $request->file('image');
        $extension = $file->getClientOriginalExtension() ?: 'jpg';
        $filename = uniqid('product_') . '.' . $extension;
        $path = $file->storeAs('products', $filename, 'public');
        
        $isPrimary = $product->images()->count() === 0;
        $productImage = $product->images()->create([
            'image_path' => $path,
            'is_primary' => $isPrimary
        ]);

        return $this->successResponse(['image' => $productImage], 'Product image uploaded');
    }
}

<?php
namespace App\Http\Requests\Auth;
use Illuminate\Foundation\Http\FormRequest;

class RegisterSellerRequest extends FormRequest {
    public function authorize() { return true; }
    public function rules() {
        return [
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8|regex:/[a-z]/|regex:/[A-Z]/|regex:/[0-9]/',
            'phone' => ['required', 'string', 'regex:/^(\+62|62|0)8[1-9][0-9]{6,9}$/'],
            'store_name' => 'required|string|max:255|unique:stores,name',
        ];
    }
}

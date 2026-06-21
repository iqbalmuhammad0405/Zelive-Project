<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;

class Profile extends Model {
    protected $fillable = ['user_id', 'phone', 'avatar', 'bio', 'gender', 'birth_date'];

    public function user() {
        return $this->belongsTo(User::class);
    }
}

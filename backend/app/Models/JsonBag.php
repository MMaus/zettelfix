<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class JsonBag extends Model {
    use HasFactory;

    protected $casts = ["content" => "object"];

    protected $hidden = [
        'user_id'
    ];

    protected $fillable = [
        'version',
        'content',
        'name',
        'sha'
    ];
}

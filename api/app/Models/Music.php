<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Music extends Model
{
    use HasFactory;

    protected $table = 'musics';

    protected $casts = [
        'created_at' => 'date:d/m/Y'
    ];

    protected $fillable = [
        'title',
        'user_id',
        'duration',
        'audio_path',
        'thumb_path',
    ];
}

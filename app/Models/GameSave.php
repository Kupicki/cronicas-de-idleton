<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class GameSave extends Model
{
    use HasFactory;

    protected $fillable = [
        'hero_name',
        'save_data',
        'last_online_at',
    ];

    protected function casts(): array
    {
        return [
            'save_data' => 'array',
            'last_online_at' => 'datetime',
        ];
    }
}

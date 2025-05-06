<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Teaching extends Model
{
    /** @use HasFactory<\Database\Factories\TeachingFactory> */
    use HasFactory;

    protected $fillable = [
        'subject_id',
        'user_id',
    ];

    public function subject()
    {
        return $this->belongsTo(Subject::class);
    }
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}

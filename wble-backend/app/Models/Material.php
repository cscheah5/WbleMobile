<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Testing\Fluent\Concerns\Has;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Material extends Model
{
    use HasFactory;
    protected $fillable = [
        'section_id',
        'type',
        'filepath',
        'filename',
    ];

    public function section()
    {
        return $this->belongsTo(Section::class);
    }
}

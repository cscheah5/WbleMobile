<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Material extends Model
{
    use HasFactory;
    
    protected $fillable = [
        'section_id',
        'type',
        'filename',
        'filepath',
    ];

    // Add a URL accessor
    protected $appends = ['download_url'];
    
    public function getDownloadUrlAttribute()
    {
        return url('/api/materials/download/' . $this->id);
    }

    public function section()
    {
        return $this->belongsTo(Section::class);
    }
}

<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Testing\Fluent\Concerns\Has;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Section extends Model{

    use HasFactory;
    protected $fillable = [
        'subject_id',
        'week_number',
        'start_date',
        'end_date',
    ];

    public function materials()
    {
        return $this->hasMany(Material::class);
    }

    public function announcements()
    {
        return $this->hasMany(Announcement::class);
    }

    public function subject()
    {
        return $this->belongsTo(Subject::class);
    }
}

<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Section extends Model
{
    public function materials()
    {
        return $this->hasMany(Material::class);
    }

    public function subject()
    {
        return $this->belongsTo(Subject::class);
    }
}

<?php

namespace App;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class WeekSection extends Model
{
    /** @use HasFactory<\Database\Factories\WeekSectionFactory> */
    use HasFactory;

    public function materials()
    {
        return $this->hasMany(Material::class);
    }
}

<?php

namespace App\Models;


use Illuminate\Database\Eloquent\Model;

class Subject extends Model
{
    //
    public function sections()
    {
        return $this->hasMany(Section::class);
    }

    public function enrollments()
    {
        return $this->hasMany(Enrollment::class);
    }
}

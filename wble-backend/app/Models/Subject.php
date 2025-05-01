<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\WeekSection; // Ensure this class exists in the specified namespace

class Subject extends Model
{
    //
    public function weekSections()
    {
        return $this->hasMany(WeekSection::class);
    }

    public function enrollments()
    {
        return $this->hasMany(Enrollment::class);
    }
}

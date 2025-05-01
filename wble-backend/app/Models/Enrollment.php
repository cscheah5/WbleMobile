<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Enrollment extends Model
{
    /** @use HasFactory<\Database\Factories\EnrollmentFactory> */
    use HasFactory;


    public function user()
    {
        return $this->belongsTo(User::class);
    }
    /**
     * The subject that the user is enrolled in.
     */
    public function subject()
    {
        return $this->belongsTo(Subject::class);
    }
}

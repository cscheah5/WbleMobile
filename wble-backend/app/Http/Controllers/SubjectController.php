<?php

namespace App\Http\Controllers;

use App\Models\Enrollment;
use Illuminate\Http\Request;
use App\Models\Subject;
use App\Models\User;
use App\Models\Teaching;

class SubjectController extends Controller
{
    // fetch subject by user id
    public function show($id)
    {
        $user = User::find($id);

        //admin role not yet implemented

        if ($user->role === 'student') {
            $enrollments = Enrollment::where('user_id', $id)->get();
            $subjectIds = $enrollments->pluck('subject_id')->toArray();
        } 
        elseif ($user->role === 'lecturer') {
            $teachings = Teaching::where('user_id', $id)->get();
            $subjectIds = $teachings->pluck('subject_id')->toArray();
        }
        else{
            $enrollments = Enrollment::where('user_id', $id)->get();
            $subjectIds = $enrollments->pluck('subject_id')->toArray();
        }
        
        $subjects = Subject::whereIn('id', $subjectIds)->get();
        return response()->json($subjects);
        // return response()->json(Subject::where('user_id', $id)->get());
    }
}

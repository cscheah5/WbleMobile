<?php

namespace App\Http\Controllers;

use App\Models\Enrollment;
use Illuminate\Http\Request;
use App\Models\Subject;

class SubjectController extends Controller
{
    // fetch subject by user id
    public function show($id)
    {
        $enrollments = Enrollment::where('user_id', $id)->get();
        $subjectIds = $enrollments->pluck('subject_id')->toArray();
        $subjects = Subject::whereIn('id', $subjectIds)->get();
        return response()->json($subjects);
        // return response()->json(Subject::where('user_id', $id)->get());
    }
}

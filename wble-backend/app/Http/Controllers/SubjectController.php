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

        if ($user->role === 'student') {
            $enrollments = Enrollment::where('user_id', $id)->get();
            $subjectIds = $enrollments->pluck('subject_id')->toArray();
        } 
        elseif ($user->role === 'lecturer') {
            $teachings = Teaching::where('user_id', $id)->get();
            $subjectIds = $teachings->pluck('subject_id')->toArray();
        }
        elseif ($user->role === 'admin') {
            $subjectIds = Subject::pluck('id')->toArray();
        }
        else{
            $enrollments = Enrollment::where('user_id', $id)->get();
            $subjectIds = $enrollments->pluck('subject_id')->toArray();
        }
        
        $subjects = Subject::whereIn('id', $subjectIds)->get();
        return response()->json($subjects);
        // return response()->json(Subject::where('user_id', $id)->get());
    }

    //create new subject
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'code' => 'required|string|max:10|unique:subjects,code',
            'description' => 'nullable|string',
        ]);

        $subject = Subject::create($request->only('name', 'code', 'description'));

    return response()->json(['message' => 'Subject created successfully', 'subject' => $subject]);
    }

    //Enroll a student in a subject
    public function enrollStudent(Request $request)
    {
        $validated = $request->validate([
            'subject_id' => 'required|exists:subjects,id',
            'user_id' => 'required|exists:users,id',
        ]);

        $alreadyEnrolled = Enrollment::where('subject_id', $validated['subject_id'])
            ->where('user_id', $validated['user_id'])
            ->exists();

        if ($alreadyEnrolled) {
            return response()->json(['message' => 'Student already enrolled'], 409);
        }

        $enrollment = new Enrollment();
        $enrollment->subject_id = $validated['subject_id'];
        $enrollment->user_id = $validated['user_id'];
        $enrollment->save();

        return response()->json(['message' => 'Student enrolled successfully'], 201);
    }
    
    //Assign a lecturer teaching a subject
    public function assignLecturer(Request $request)
    {
        $validated = $request->validate([
            'subject_id' => 'required|exists:subjects,id',
            'user_id' => 'required|exists:users,id',
        ]);

        $alreadyAssigned = Teaching::where('subject_id', $validated['subject_id'])
            ->where('user_id', $validated['user_id'])
            ->exists();

        if ($alreadyAssigned) {
            return response()->json(['message' => 'Lecturer already assigned'], 409);
        }

        $teaching = new Teaching();
        $teaching->subject_id = $validated['subject_id'];
        $teaching->user_id = $validated['user_id'];
        $teaching->save();

        return response()->json(['message' => 'Lecturer assigned successfully'], 201);
    }
}

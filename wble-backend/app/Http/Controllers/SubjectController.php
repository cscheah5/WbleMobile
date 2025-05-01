<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Subject;

class SubjectController extends Controller
{
    // fetch subject by user id
    public function show($id)
    {
        return response()->json(Subject::where('user_id', $id)->get());
    }
}

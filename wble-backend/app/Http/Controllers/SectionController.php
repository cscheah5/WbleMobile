<?php

namespace App\Http\Controllers;

use App\Models\Section;
use Illuminate\Http\Request;

class SectionController extends Controller
{
    public function show($id)
    {

        // Fetch the week section by ID
        $weekSections = Section::where('subject_id', $id)->get();

        // Check if the week section exists
        if (!$weekSections) {
            return response()->json(['message' => 'Week section not found'], 404);
        }

        // Return the week section data
        return response()->json($weekSections);
    }
}

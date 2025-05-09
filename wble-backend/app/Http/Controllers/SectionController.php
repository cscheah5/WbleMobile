<?php

namespace App\Http\Controllers;

use App\Models\Section;
use Illuminate\Http\Request;
use App\Models\Announcement;
use App\Models\Material;

class SectionController extends Controller
{
    public function showCurrentWeek($id)
    {
        // Get current date
        $currentDate = now()->toDateString();
        
        // Fetch the section where current date falls between start_date and end_date
        $currentWeekSection = Section::where('subject_id', $id)
            ->whereDate('start_date', '<=', $currentDate)
            ->whereDate('end_date', '>=', $currentDate)
            ->first();

        // Check if the current week section exists
        if (!$currentWeekSection) {
            return response()->json(['message' => 'Current week section not found'], 404);
        }

        $materials = Material::where('section_id', $currentWeekSection->id)->get();
        $announcements = Announcement::where('section_id', $currentWeekSection->id)->get();

        // Return the current week section data
        return response()->json([
            'section' => $currentWeekSection,
            'materials' => $materials,
            'announcements' => $announcements
        ]);
    }
    
    public function showAll($id)
    {
        // Fetch all week sections for this subject
        $weekSections = Section::where('subject_id', $id)
            ->orderBy('week_number', 'asc')
            ->get();

        // Check if any week sections exist
        if ($weekSections->isEmpty()) {
            return response()->json(['message' => 'No week sections found for this subject'], 404);
        }

        // For each section, get its materials and announcements
        $sectionsWithContent = $weekSections->map(function($section) {
            $section->materials = Material::where('section_id', $section->id)->get();
            $section->announcements = Announcement::where('section_id', $section->id)->get();
            return $section;
        });

        // Return the week sections data
        return response()->json($sectionsWithContent);
    }

    public function showMaterials($id)
    {
        // Get all sections for this subject
        $sections = Section::where('subject_id', $id)->get();
        
        if ($sections->isEmpty()) {
            return response()->json(['message' => 'No sections found for this subject'], 404);
        }
        
        // Get all section IDs
        $sectionIds = $sections->pluck('id');
        
        // Get all materials for these sections
        $materials = Material::whereIn('section_id', $sectionIds)
            ->orderBy('created_at', 'desc')
            ->get();
            
        if ($materials->isEmpty()) {
            return response()->json(['message' => 'No materials found for this subject'], 404);
        }
        
        // For each material, add the section information
        $materialsWithSection = $materials->map(function($material) {
            $section = Section::find($material->section_id);
            $material->week_number = $section->week_number;
            $material->section_title = "Week {$section->week_number}";
            return $material;
        });
        
        // Return all materials
        return response()->json($materialsWithSection);
    }

    public function store(Request $request)
    {
        $request->validate([
            'subject_id' => 'required|exists:subjects,id',
            'week_number' => 'required|integer',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after_or_equal:start_date',
        ]);

        $section = Section::create($request->all());
        
        return response()->json($section, 201);
    }

}

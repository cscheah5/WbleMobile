<?php

namespace App\Http\Controllers;

use App\Models\Material;
use App\Models\Section;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class MaterialController extends Controller
{
    public function upload(Request $request)
    {
        $request->validate([
            'section_id' => 'required|exists:sections,id',
            'type' => 'required|in:lecture,tutorial,practical,others',
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'file' => 'required|file|max:10240', // 10MB max
        ]);

        // Store the file
        $file = $request->file('file');
        $originalName = $file->getClientOriginalName();
        $extension = $file->getClientOriginalExtension();
        $filename = Str::slug(pathinfo($originalName, PATHINFO_FILENAME)) . '_' . time() . '.' . $extension;
        $path = $file->storeAs('materials/' . $request->type, $filename, 'public');

        // Create the material record
        $material = Material::create([
            'section_id' => $request->section_id,
            'type' => $request->type,
            'filename' => $originalName,
            'filepath' => $path,
        ]);

        return response()->json($material, 201);
    }

    public function download($id)
    {
        $material = Material::findOrFail($id);
        
        if (!Storage::disk('public')->exists($material->filepath)) {
            return response()->json(['error' => 'File not found'], 404);
        }

        $path = Storage::disk('public')->path($material->filepath);
        return response()->download($path, $material->filename);
    }
}

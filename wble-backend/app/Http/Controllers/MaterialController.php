<?php

namespace App\Http\Controllers;

use App\Models\Material;
use App\Models\Section;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Log;

class MaterialController extends Controller
{
    public function upload(Request $request)
    {
        $request->validate([
            'section_id' => 'required|exists:sections,id',
            'type' => 'required|in:lecture,tutorial,practical,others', // Validate against allowed types
            'file' => 'required|file|max:10240', // 10MB max
        ]);
        
        // Normalize folder name to match database enum
        $folderType = $request->type === 'other' ? 'others' : $request->type;
        
        // Store the file
        $file = $request->file('file');
        $filename = $file->getClientOriginalName();
        $path = $file->storeAs('materials/' . $folderType, $filename, 'public');
        
        // Create database record
        $material = Material::create([
            'section_id' => $request->section_id,
            'type' => $folderType, // Always use the normalized value
            'filename' => $filename,
            'filepath' => $path,
        ]);
        
        return response()->json($material, 201);
    }

    public function update(Request $request, $id)
    {
        $material = Material::findOrFail($id);
        
        $request->validate([
            'type' => 'required|string',
            'title' => 'nullable|string|max:255',
            'description' => 'nullable|string',
        ]);
        
        $material->update([
            'type' => $request->type,
            'title' => $request->title,
            'description' => $request->description,
        ]);
        
        return response()->json($material, 200);
    }

    public function destroy($id)
    {
        $material = Material::findOrFail($id);
        
        // Delete the file from storage
        if (Storage::disk('public')->exists($material->filepath)) {
            Storage::disk('public')->delete($material->filepath);
        }
        
        $material->delete();
        
        return response()->json(['message' => 'Material deleted successfully'], 200);
    }

    public function download($id)
    {
        $material = Material::findOrFail($id);
        
        if (!Storage::disk('public')->exists($material->filepath)) {
            return response()->json(['error' => 'File not found'], 404);
        }
        
        $path = storage_path('app/public/' . $material->filepath);
        
        // Log for debugging
        Log::info('Downloading file: ' . $path);
        
        return response()->download($path, $material->filename);
    }

    public function publicDownload($id)
    {
        $material = Material::findOrFail($id);
        
        if (!Storage::disk('public')->exists($material->filepath)) {
            return response()->json(['error' => 'File not found'], 404);
        }
        
        $path = storage_path('app/public/' . $material->filepath);
        
        // Log for debugging
        Log::info('Public downloading file: ' . $path);
        
        // Disable CSRF for this download
        return response()->download($path, $material->filename);
    }
}

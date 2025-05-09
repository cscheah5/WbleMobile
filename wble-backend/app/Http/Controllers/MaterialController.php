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
            'section_id' => 'required',
            'type' => 'required|string|in:lecture,tutorial,practical,others',
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
            'type' => $folderType,
            'filename' => $filename,
            'filepath' => $path,
        ]);
        
        return response()->json($material, 201);
    }

    public function update(Request $request, $id)
    {
        $material = Material::findOrFail($id);
        
        // Log incoming request data for debugging
        Log::info('Material update request:', [
            'id' => $id,
            'has_file' => $request->hasFile('file'),
            'content_type' => $request->header('Content-Type'),
            'fields' => $request->all()
        ]);
        
        try {
            // Validate the request
            $validatedData = $request->validate([
                'type' => 'required|string|in:lecture,tutorial,practical,others',
                'file' => 'nullable|file|max:10240', // 10MB max
            ]);
            
            // Update the material type
            $material->type = $validatedData['type'];
            
            // Handle file upload if provided
            if ($request->hasFile('file')) {
                // Log file info
                Log::info('Processing file upload', [
                    'original_name' => $request->file('file')->getClientOriginalName(),
                    'size' => $request->file('file')->getSize(),
                ]);
                
                // Delete the existing file if it exists
                if ($material->filepath && Storage::disk('public')->exists($material->filepath)) {
                    Storage::disk('public')->delete($material->filepath);
                }
                
                // Get the file and store it
                $file = $request->file('file');
                $filename = $file->getClientOriginalName();
                
                // Store in the appropriate folder
                $folderType = $material->type === 'other' ? 'others' : $material->type;
                $path = $file->storeAs('materials/' . $folderType, $filename, 'public');
                
                // Update the material with new file info
                $material->filename = $filename;
                $material->filepath = $path;
            }
            
            // Save the changes
            $material->save();
            
            return response()->json($material, 200);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'An error occurred',
                'error' => $e->getMessage()
            ], 500);
        }
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
<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class UserController extends Controller
{
    public function storeFCMtoken(Request $request)
    {
        $user = auth()->user();
        $user->fcm_token = $request->fcm_token;
        $user->save();
        return response()->json(['message' => 'fcm token saved successfully']);
    }

    public function getByRole(Request $request)
    {
        $role = $request->query('role');

        if (!in_array($role, ['student', 'lecturer'])) {
            return response()->json(['error' => 'Invalid role'], 400);
        }

        $users = \App\Models\User::where('role', $role)->get();
        return response()->json($users);
    }
}

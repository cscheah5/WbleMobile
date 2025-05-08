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
}

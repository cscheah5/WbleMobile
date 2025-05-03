<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;


class FriendController extends Controller
{
    public function index()
    {
        // Get all friends of the authenticated user
        $userId = auth()->user()->id;
        $results = DB::select("SELECT * FROM friends WHERE user_id1 = ? OR user_id2 = ? WHERE status = accepted", [$userId, $userId]);
        return response()->json($results);
    }
}

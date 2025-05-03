<?php

namespace App\Http\Controllers;

use App\Models\Friend;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;


class FriendController extends Controller
{
    public function index()
    {
        // Get all friends of the authenticated user
        $userId = auth()->user()->id;

        // Fetch friendships where the authenticated user is either user_id1 or user_id2
        $acceptedFriendships = Friend::where(function ($query) use ($userId) {
            $query->where('user_id1', $userId)
                ->orWhere('user_id2', $userId);
        })->where('status', 'accepted')->get();

        $pendingFriendships = Friend::where(function ($query) use ($userId) {
            $query->where('user_id1', $userId)
                ->orWhere('user_id2', $userId);
        })->where('status', 'pending')->get();

        // Extract the friend IDs from the friendships
        $acceptedFriendIds = $acceptedFriendships->map(function ($friendship) use ($userId) {
            return $friendship->user_id1 === $userId ? $friendship->user_id2 : $friendship->user_id1;
        });
        $pendingFriendIds = $pendingFriendships->map(function ($friendship) use ($userId) {
            return $friendship->user_id1 === $userId ? $friendship->user_id2 : $friendship->user_id1;
        });

        // Fetch the user details for each friend ID
        $acceptedFriends = $acceptedFriendIds->map(function ($friendId) {
            return User::find($friendId);
        });

        $pendingFriends = $pendingFriendIds->map(function ($friendId) {
            return User::find($friendId);
        });

        return response()->json([
            'accepted_friends' => $acceptedFriends,
            'pending_friends' => $pendingFriends,
        ]);
    }

    public function searchUser(Request $request)
    {
        // Search for users by name
        $name = $request->input('name');
        $userId = auth()->user()->id;

        $searchedUser = User::where('username', 'like', '%' . $name . '%')
            ->where('id', '!=', $userId)
            ->get();

        return response()->json($searchedUser);
    }
}

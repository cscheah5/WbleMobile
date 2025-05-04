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

        // Extract the friend IDs from the friendships
        $acceptedFriendIds = $acceptedFriendships->map(function ($friendship) use ($userId) {
            return $friendship->user_id1 === $userId ? $friendship->user_id2 : $friendship->user_id1;
        });

        // Fetch the user details for each friend ID
        $acceptedFriends = $acceptedFriendIds->map(function ($friendId) {
            return User::find($friendId);
        });

        return response()->json($acceptedFriends);
    }

    // !to be removed
    public function getPendingFriendShips()
    {
        // Get all pending friend requests for the authenticated user
        $userId = auth()->user()->id;

        $pendingFriendships = Friend::where(function ($query) use ($userId) {
            $query->where('user_id1', $userId)
                ->orWhere('user_id2', $userId);
        })->where('status', 'pending')->get();

        // Extract the friend IDs from the friendships
        $pendingFriendIds = $pendingFriendships->map(function ($friendship) use ($userId) {
            return $friendship->user_id1 === $userId ? $friendship->user_id2 : $friendship->user_id1;
        });

        // Fetch the user details for each friend ID
        $pendingFriends = $pendingFriendIds->map(function ($friendId) {
            return User::find($friendId);
        });

        return response()->json($pendingFriends);
    }
    public function searchUser(Request $request)
    {
        // Get search parameters
        $name = $request->get('username');
        $userId = auth()->user()->id;

        // Search for users by name, excluding self
        $users = User::where('username', 'like', '%' . $name . '%')
            ->where('id', '!=', $userId)
            ->get();

        // Get all friendship records related to the current user in a single query
        $friendships = Friend::where(function ($query) use ($userId) {
            $query->where('user_id1', $userId)
                ->orWhere('user_id2', $userId);
        })
            ->whereIn('status', ['accepted', 'pending'])
            ->get();

        // Create lookup maps for accepted and pending friendships
        $acceptedFriendIds = [];
        $pendingFriendships = [];

        foreach ($friendships as $friendship) {
            $otherUserId = ($friendship->user_id1 == $userId) ? $friendship->user_id2 : $friendship->user_id1;

            if ($friendship->status === 'accepted') {
                $acceptedFriendIds[] = $otherUserId;
            } else if ($friendship->status === 'pending') {
                $pendingFriendships[$otherUserId] = $friendship;
            }
        }

        // Filter out accepted friends and mark pending requests
        $searchResult = $users->filter(function ($user) use ($acceptedFriendIds) {
            // Exclude users who are already friends
            return !in_array($user->id, $acceptedFriendIds);
        })->map(function ($user) use ($pendingFriendships, $userId) {
            // Set requested property based on pending status
            $user->requested = isset($pendingFriendships[$user->id]);
            return $user;
        })->values(); // Reset array keys

        return response()->json($searchResult);
    }

    public function sendFriendRequest(Request $request)
    {
        // Send a friend request
        $userId = auth()->user()->id;
        $friendId = $request->input('friend_id');

        // Check if the friend request already exists
        $existingRequest = Friend::where(function ($query) use ($userId, $friendId) {
            $query->where('user_id1', $userId)
                ->where('user_id2', $friendId);
        })->orWhere(function ($query) use ($userId, $friendId) {
            $query->where('user_id1', $friendId)
                ->where('user_id2', $userId);
        })->first();

        if ($existingRequest) {
            return response()->json(['message' => 'Friend request already sent or exists'], 400);
        }

        // Create a new friend request
        // *Gotcha: user_id1 is the sender
        // *Gotcha: user_id2 is the receiver
        Friend::create([
            'user_id1' => $userId,
            'user_id2' => $friendId,
            'status' => 'pending',
        ]);

        return response()->json(['message' => 'Friend request sent successfully']);
    }

    public function acceptFriendRequest(Request $request)
    {
        // Accept a friend request
        $userId = auth()->user()->id;
        $friendId = $request->input('friend_id');

        // Check if the friend request exists and is pending
        $friendship = Friend::where(function ($query) use ($userId, $friendId) {
            $query->where('user_id1', $friendId)
                ->where('user_id2', $userId);
        })->where('status', 'pending')->first();

        if (!$friendship) {
            return response()->json(['message' => 'No pending friend request found'], 404);
        }

        // Update the status to accepted
        $friendship->update(['status' => 'accepted']);

        return response()->json(['message' => 'Friend request accepted successfully']);
    }

    public function rejectFriendRequest(Request $request)
    {
        // Reject a friend request
        $userId = auth()->user()->id;
        $friendId = $request->input('friend_id');

        // Check if the friend request exists and is pending
        $friendship = Friend::where(function ($query) use ($userId, $friendId) {
            $query->where('user_id1', $friendId)
                ->where('user_id2', $userId);
        })->where('status', 'pending')->first();

        if (!$friendship) {
            return response()->json(['message' => 'No pending friend request found'], 404);
        }

        // Delete the friendship record
        $friendship->delete();

        return response()->json(['message' => 'Friend request rejected successfully']);
    }
}

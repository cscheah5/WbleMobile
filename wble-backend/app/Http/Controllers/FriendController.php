<?php

namespace App\Http\Controllers;

use App\Models\Friend;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Http;

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

    public function sendFriendRequest($friendId)
    {
        // Send a friend request
        $userId = auth()->user()->id;

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
        $friend = new Friend;
        $friend->user_id1 = $userId;
        $friend->user_id2 = $friendId;
        $friend->status = 'pending';
        $friend->save();

        // sending notification to the receiver
        $receiver = User::find($friendId);
        if ($receiver && $receiver->fcm_token) {
            $title = "New Friend Request";
            $body = auth()->user()->username . " sent you a friend request.";

            Http::withHeaders([
                'X-Internal-Secret' => env('FLASK_INTERNAL_SECRET'),
            ])->post(env('FLASK_SERVER_URL') . '/send-notification', [
                'fcm_token' => $receiver->fcm_token,
                'title' => $title,
                'body' => $body,
            ]);
        }


        return response()->json(['message' => 'Friend request sent successfully']);
    }

    public function getFriendRequests()
    {
        // Get all friend requests for the authenticated user
        $userId = auth()->user()->id;

        // Fetch pending friend requests where the authenticated user is user_id2
        $friendRequests = Friend::where('user_id2', $userId)
            ->where('status', 'pending')
            ->get();

        $friendRequestIds = $friendRequests->map(function ($friendship) {
            return $friendship->user_id1;
        });

        // Fetch user details for each friend request
        $friendRequestUsers = User::whereIn('id', $friendRequestIds)->get();

        return response()->json($friendRequestUsers);
    }

    public function acceptFriendRequest($friendId)
    {
        // Accept a friend request
        $userId = auth()->user()->id;

        // Check if the friend request exists and is pending
        $friendship = Friend::where(function ($query) use ($userId, $friendId) {
            $query->where('user_id1', $friendId)
                ->where('user_id2', $userId);
        })->where('status', 'pending')->first();

        if (!$friendship) {
            return response()->json(['message' => 'No pending friend request found'], 404);
        }

        // Update the status to accepted without mass assignment
        $friendship->status = 'accepted';
        $friendship->save();

        return response()->json(['message' => 'Friend request accepted successfully']);
    }

    public function rejectFriendRequest($friendId)
    {
        // Reject a friend request
        $userId = auth()->user()->id;

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

    public function unfriend($friendId)
    {
        // Unfriend a user
        $userId = auth()->user()->id;

        // Check if the friendship exists and is accepted
        $friendship = Friend::where(function ($query) use ($userId, $friendId) {
            $query->where('user_id1', $userId)
                ->where('user_id2', $friendId);
        })->orWhere(function ($query) use ($userId, $friendId) {
            $query->where('user_id1', $friendId)
                ->where('user_id2', $userId);
        })->where('status', 'accepted')->first();

        if (!$friendship) {
            return response()->json(['message' => 'No friendship found'], 404);
        }

        // Delete the friendship record
        $friendship->delete();

        return response()->json(['message' => 'Unfriended successfully']);
    }
}

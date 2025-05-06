<?php

namespace App\Http\Controllers;

use App\Models\Message;
use Illuminate\Http\Request;

class MessageController extends Controller
{
    /*
    This method will retieve all the messages between the user and the friend
    */

    public function show($friendId)
    {

        $userId = auth()->user()->id;

        $messages = Message::where(function ($query) use ($userId, $friendId) {
            $query->where('sender_id', $userId)->where('receiver_id', $friendId);
        })->orWhere(function ($query) use ($userId, $friendId) {
            $query->where('sender_id', $friendId)->where('receiver_id', $userId);
        })->orderBy('created_at', 'asc')->get();

        return response()->json($messages);
    }

    /*
    Create new message and store in database
    */
    public function createMessage(Request $request)
    {
        $request->validate([
            'friendId' => 'required|exists:users,id',
            'message' => 'required|string|max:1000',
        ]);

        $messageORM = new Message();
        $messageORM->sender_id = auth()->user()->id;
        $messageORM->receiver_id = $request->friendId;
        $messageORM->message = $request->message;


        if ($messageORM->save())
            return response()->json(['message' => 'Message created successfully']);
        return response()->json(['message' => 'Failed to create message'], 500);
    }
}

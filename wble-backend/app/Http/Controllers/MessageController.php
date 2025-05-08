<?php

namespace App\Http\Controllers;

use App\Models\Message;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

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

        // sending notification to the receiver
        $receiver = User::find($request->friendId);
        if ($receiver && $receiver->fcm_token) {
            $title = "New Messages";
            $body = auth()->user()->username . ": sent you a messsage.";

            Http::withHeaders([
                'X-Internal-Secret' => env('FLASK_INTERNAL_SECRET'),
            ])->post(env('FLASK_SERVER_URL') . '/send-notification', [
                'fcm_token' => $receiver->fcm_token,
                'title' => $title,
                'body' => $body,
            ]);
        }

        if ($messageORM->save())
            return response()->json(['message' => 'Message created successfully']);
        return response()->json(['message' => 'Failed to create message'], 500);
    }
}

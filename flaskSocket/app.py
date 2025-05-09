from flask import Flask, request
from flask_socketio import SocketIO, emit
from dotenv import load_dotenv
import os
import jwt
import requests


app = Flask(__name__)
socketio = SocketIO(app, cors_allowed_origins="*")

load_dotenv()  # Loads variables from .env into the environment
app.config['SECRET_KEY'] = os.getenv("LARAVEL_JWT_SECRET")
NOTIFICATION_INTERNAL_SECRET=os.getenv("NOTIFICATION_INTERNAL_SECRET")
NOTIFICATION_SERVER_URL=os.getenv("NOTIFICATION_SERVER_URL")

# only connected users can receive messages in live
connected_users={}

@socketio.on('connect')
def handle_connect():
    jwtToken = request.args.get('userToken')
    try:
        # the algo can be find in laravel config/jwt.php
        user = jwt.decode(jwtToken, app.config['SECRET_KEY'], algorithms=['HS256']) 
        username = user.get('sub')
        print(f"-------------------------------------------------User name: {username}")
        connected_users[username] = request.sid
        print(f"{username} connected with SID {request.sid}")
    except Exception as e:
        print(f"Connection rejected:", str(e))
        return False # reject connection

@socketio.on('private_message')
def handle_private_message(data):
    senderId = data['senderId']
    senderName = data['senderName']
    receiverId = data['receiverId']
    receiverName = data['receiverName']
    receiverFCMToken = data['receiverFCMToken']
    message = data['message']

    print(f"Sender ID: {senderId}, Sender Name: {senderName}, Receiver ID: {receiverId}, Receiver Name: {receiverName}, message: {message}")
    if receiverName in connected_users:

        payload = {
            'fcm_token': receiverFCMToken,
            'title': 'New messages (from socket)',
            'body': f"{senderName} sent you a message."
        }

        headers = {
            'X-Internal-Secret': NOTIFICATION_INTERNAL_SECRET,
            'Content-Type': 'application/json'
        }

        try:
            response = requests.post(NOTIFICATION_SERVER_URL + "/send-notification", json=payload, headers=headers)
        except Exception as e:
            print("Notification send failed:", str(e))

        emit('private_message', {
            'senderId': senderId,
            'receiverId': receiverId,
            'message': message
        }, room=connected_users[receiverName])  # Sends message directly to receiver's connection.

@socketio.on('send_friend_request')
def handle_friend_request(data):
    # user object
    # {"created_at": "2025-05-06T14:21:51.000000Z", "email_verified_at": null, "id": 2, "requested": false, "role": "student", "updated_at": "2025-05-06T14:21:51.000000Z", "username": "user2"}
    username = data['friend']['username']

    # --- POST request to another server ---
    target_url = NOTIFICATION_SERVER_URL + "/send-notification"

    print(f"Socket received friend request {data['friend']}")
    if username in connected_users:

        # send notification title and body to the notification server
        payload = {
            'fcm_token': data['friend']['fcm_token'],
            'title': 'New Friend Request (socket)',
            'body': f"{username} sent you a friend request"
        }
        headers = {
            'X-Internal-Secret': NOTIFICATION_INTERNAL_SECRET,
            'Content-Type': 'application/json' 
        }

        try:
            response = requests.post(target_url, json=payload, headers=headers)
        except:
            print("notification sent failed:", e)
        
        emit("receive_friend_request", {
            'friend': data['friend']
        }, room=connected_users[username])


@socketio.on('disconnect')
def handle_disconnect():
    sid = request.sid
    for username, stored_sid in list(connected_users.items()):
        if stored_sid == sid:
            print(f"{username} disconnected")
            del connected_users[username]
            break



if __name__ == '__main__':
    socketio.run(app,host='0.0.0.0', port=5001, debug='true')
from flask import Flask, request
from flask_socketio import SocketIO, emit
from dotenv import load_dotenv
import os
import jwt


app = Flask(__name__)
socketio = SocketIO(app, cors_allowed_origins="*")

load_dotenv()  # Loads variables from .env into the environment
app.config['SECRET_KEY'] = os.getenv("LARAVEL_JWT_SECRET")

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
    message = data['message']

    print(f"Sender ID: {senderId}, Sender Name: {senderName}, Receiver ID: {receiverId}, Receiver Name: {receiverName}, message: {message}")
    if receiverName in connected_users:
        emit('private_message', {
            'senderId': senderId,
            'receiverId': receiverId,
            'message': message
        }, room=connected_users[receiverName]) #Sends message directly to receiver's connection.

# Disconnect not tested yet....
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
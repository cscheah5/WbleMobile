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

@socketio.on('connect', namespace='/chat')
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

@socketio.on('private_message', namespace='/chat')
def handle_private_message(data):
    receiver = data['to']
    message = data['message']
    sender_token = data['userToken']

    try:
        sender = jwt.decode(sender_token, app.config['SECRET_KEY'], algorithms=['HS256'])
        sender_name = sender.get('sub')
        print(f"Message from {sender_name} to {receiver}: {message}")

        # emit to the receiver if connected
        if receiver in connected_users:
            emit('private_message', {
                'from': sender_name,
                'message': message
            }, room=connected_users[receiver]) #Sends message directly to receiver's connection.
    except jwt.ExpiredSignatureError:
        emit('error', {'message': 'Token expired'})
    except Exception as e:
        emit('error', {'message': str(e)})


@socketio.on('disconnect')
def handle_disconnect():
    sid = request.sid
    for username, stored_sid in list(connected_users.items()):
        if stored_sid == sid:
            print(f"{username} disconnected")
            del connected_users[username]
            break



if __name__ == '__main__':
    socketio.run(app,host='0.0.0.0', port=5000, debug='true')
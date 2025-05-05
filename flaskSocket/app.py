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




if __name__ == '__main__':
    socketio.run(app,host='0.0.0.0', port=5000, debug='true')
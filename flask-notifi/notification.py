from flask import Flask, request, jsonify
from google.oauth2 import service_account
import google.auth.transport.requests
import requests
import os
import jwt

app = Flask(__name__)
app.config['SECRET_KEY'] = os.environ.get("LARAVEL_JWT_SECRET")

# Config
SCOPES = ['https://www.googleapis.com/auth/firebase.messaging']
SERVICE_ACCOUNT_FILE = os.environ.get('GOOGLE_APPLICATION_CREDENTIALS')
PROJECT_ID = 'wblemobile-b20a0' #your firebase project id

def get_access_token():
    credentials = service_account.Credentials.from_service_account_file(
        SERVICE_ACCOUNT_FILE, scopes=SCOPES
    )
    request_obj = google.auth.transport.requests.Request()
    credentials.refresh(request_obj)
    return credentials.token

def send_push_notification(fcm_token, title, body):
    access_token = get_access_token()
    url = f'https://fcm.googleapis.com/v1/projects/{PROJECT_ID}/messages:send'

    headers = {
        'Authorization': f'Bearer {access_token}',
        'Content-Type': 'application/json',
    }

    message = {
        'message': {
            'token': fcm_token,
            'notification': {
                'title': title,
                'body': body,
            }
        }
    }

    response = requests.post(url, headers=headers, json=message)
    return response

@app.route('/send-notification', methods=['POST'])
def send_notification():
    data = request.get_json()
    auth_header = request.headers.get('Authorization')
    fcm_token = data.get('fcm_token')
    title = data.get('title')
    body = data.get('body')
    
    if not auth_header or not auth_header.startswith('Bearer '):
        return jsonify({'error': 'Missing or invalid Authorization header'}), 401
    
    # extract the token
    jwt_token = auth_header.split(' ')[1]
        
    # Decode the JWT
    try:
        user = jwt.decode(jwt_token, app.config['SECRET_KEY'], algorithms=['HS256'])
    except jwt.InvalidTokenError as e:
        return jsonify({'error': 'Invalid or expired token', 'details': str(e)}), 401

    if not all([fcm_token, title, body]):
        return jsonify({'error': 'Missing required fields'}), 400

    res = send_push_notification(fcm_token, title, body)

    if res.status_code == 200:
        return jsonify({'message': 'Notification sent successfully'})
    else:
        return jsonify({'error': 'Failed to send notification', 'details': res.text}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)

from flask import Flask, request, jsonify
from google.oauth2 import service_account
import google.auth.transport.requests
import requests
import os

app = Flask(__name__)
FLASK_SECRET = os.environ.get('FLASK_INTERNAL_SECRET')

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
	fcm_token = data.get('fcm_token')
	title = data.get('title')
	body = data.get('body')
	
	if request.headers.get('X-Internal-Secret') != FLASK_SECRET:
		return jsonify({'error': 'Unauthorized'}), 401

	if not all([fcm_token, title, body]):
		return jsonify({'error': 'Missing required fields'}), 400

	res = send_push_notification(fcm_token, title, body)

	if res.status_code == 200:
		return jsonify({'message': 'Notification sent successfully'})
	else:
		return jsonify({'error': 'Failed to send notification', 'details': res.text}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5002)

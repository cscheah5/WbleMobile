# WBLE 
## Default Accounts

| User Type | Username | Password |
|-----------|----------|----------|
| Student   | user1    | 123456   |
| Student   | user2    | 123456   |
| Lecturer  | leemj    | 123456   |
| Admin     | admin    | 123456   |

## Install python dependencies (at root directory)
```bash
pip install -r requirements.txt
```

# WBLE Flask Socket
1. Navigate to the Flask Socket directory:
   ```bash
   cd flaskSocket
   ```

2. Create a `.env` file by copying the example:
   ```bash
   cp .env.example .env

3. Find your JWT secret key in the WBLE backend Laravel `.env` file and add it to your Flask Socket `.env`:
   ```ini
   LARAVEL_JWT_SECRET=your-jwt-secret-key
   ```
   
4. Start the backend server:
   ```bash
   python app.py
   ```
   The server will run on `http://0.0.0.0:5001` by default. You can modify this port in `flaskSocket/app.py`

# WBLE Notification Server
1. Navigate to the Flask Notification directory:
   ```bash
   cd flask-notifi
   ```

2. Create a `.env` file by copying the example:
   ```bash
   cp .env.example .env

3. Configure Firebase & Application Credentials
- **Create a Firebase Project** (if not done already)  
- Download your **Service Account JSON** file from Your Firebase Project   
- Update `.env` with the correct path:  
  ```ini
  GOOGLE_APPLICATION_CREDENTIALS=path/to/your-service-account.json
  FLASK_INTERNAL_SECRET=your_internal_secret_here  # Must match Laravel's .env
  ```
- Configure Firebase details in `flask-notifi/notification.py` (if needed).
- Example: change the firebase project id based on your use case  

4. Sync `FLASK_INTERNAL_SECRET` with Laravel Backend
   Ensure the same secret is in `NOTIFICATION_INTERNAL_SECRET` of Laravel’s `.env`:  
   ```ini
   FLASK_INTERNAL_SECRET=your_internal_secret_here
   ```
   
5. Start the backend server:
   ```bash
   python notification.py
   ```
   The server will run on `http://0.0.0.0:5002` by default. You can modify this port in `flask-notifi/notification.py`

### **📌 Example Folder Structure**  
```
flask-notifi/
├── .env                    # Config file
├── firebase-adminsdk.json  # Firebase credentials
├── notification.py         # Main server script
└── ...
```

# WBLE Front-end
1. Navigate to the React Native project directory:
   ```bash
   cd WbleMobile
   ```

2. Install React Native dependencies:
   ```bash
   npm install
   ```

3. Create and configure the app configuration file:
   ```bash
   cd src/config
   cp config.example.json config.json
   ```

4. Configure server paths in `src/config/config.js` to point to your backend servers

5. Run the React Native application:
   ```bash
   npx react-native run-android
   # or
   npx react-native run-ios
   ```
   
# WBLE Backend

This repository contains the backend API for the WBLE (Web-Based Learning Environment) application. It's built with Laravel PHP framework and uses JWT authentication.

## Installation

Follow these steps to set up the project locally:

1. Clone the repository:
```bash
git clone https://github.com/yourusername/wble-backend.git
cd wble-backend
```

2. Install PHP dependencies:
```bash
composer install
```

3. Create environment file:
```bash
cp .env.example .env
```

4. Configure your `.env` file with your database credentials and other settings.

5. Generate application key:
```bash
php artisan key:generate
```

6. Create database.sqlite in the database folder
```bash
wble-backend
|-database
|  |-database.sqlite
```

7. Run migrations (this will create fresh tables and seeds your database):
```bash
php artisan migrate:fresh --seed
```

8. Generate JWT secret:
```bash
php artisan jwt:secret
```

9. Link the storage for file downloads:
```bash
php artisan storage:link
```

10. Sync `NOTIFICATION_INTERNAL_SECRET` with `FLASK_INTERNAL_SECRET` of Notification Server (if not done)
   Ensure the same secret is in Notification Server’s `.env`:  
   ```ini
   NOTIFICATION_INTERNAL_SECRET=your-internal-secret-here
   ```

11. Ensure `NOTIFICATION_SERVER_URL` with points to the notification server
   ```ini
   NOTIFICATION_SERVER_URL=http://127.0.0.1:5002
   ```

12. Start the development server:
   ```bash
   php artisan serve
   ```

The application will be available at `http://localhost:8000`.

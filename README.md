# WBLE 
## Default Accounts

| User Type | Username | Password |
|-----------|----------|----------|
| Student   | user1    | 123456   |
| Student   | user2    | 123456   |
| Lecturer  | leemj    | 123456   |
| Admin     | admin    | 123456   |

# WBLE Flask Socket
## Python dependencies
```bash
pip install Flask Flask-SocketIO python-dotenv PyJWT
```

## Optional Python dependencies (but often used with Flask-SocketIO)
```bash
pip install eventlet
```

1. Navigate to the Flask Socket directory:
   ```bash
   cd flaskSocket
   ```

2. Create a `.env` file by copying the example:
   ```bash
   cp .env.example .env

3. Find your JWT secret key in the WBLE backend Laravel `.env` file and add it to your Flask Socket `.env`:
   ```
   LARAVEL_JWT_SECRET=your-jwt-secret-key
   ```
   
4. Start the backend server:
   ```bash
   python app.py
   ```
   The server will run on `http://0.0.0.0:5001` by default. You can modify this port in `flaskSocket/app.py`

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
   cp config.example.js config.js
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

9. Start the development server:
```bash
php artisan serve
```

The application will be available at `http://localhost:8000`.

# WBLE Flask Socket
need to create ```.env``` file and put this env variable
```LARAVEL_JWT_SECRET=your-jwt-secret-key```

# WBLE Front-end
Configure server path at src/config/config.js

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

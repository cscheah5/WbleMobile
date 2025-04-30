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

6. Run migrations (this will create fresh tables in your database):
```bash
php artisan migrate:fresh
```

7. Generate JWT secret:
```bash
php artisan jwt:secret
```

8. Start the development server:
```bash
php artisan serve
```

The application will be available at `http://localhost:8000`.

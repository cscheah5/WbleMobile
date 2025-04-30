in wble-backend
Run
cd wble-backend
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate:fresh
php artisan jwt:secret
php artisan serve

# Zelive Project

Zelive is a full-stack web application featuring a **Laravel** backend and an **Ionic/Angular** frontend.

## Project Structure

- `/backend`: Contains the Laravel backend API, database migrations, models, and controllers.
- `/frontend`: Contains the Ionic/Angular frontend application.

## Requirements

- PHP & Composer (for Backend)
- Node.js & npm (for Frontend)
- MySQL/SQLite database

## Setup Instructions

### 1. Backend Setup (Laravel)
```bash
cd backend
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate
php artisan serve
```

### 2. Frontend Setup (Ionic/Angular)
```bash
cd frontend
npm install
ionic serve
```

## Environment Configuration
Make sure to configure the correct API URL and Firebase credentials in the frontend environment files (`frontend/src/environments/environment.ts`) to match your backend and Firebase project settings.

## License
Proprietary
# Zelive Project 🌎

*(Scroll down for the Indonesian version / Scroll ke bawah untuk versi Bahasa Indonesia)*

## 🇬🇧 English Version

Zelive is a full-stack web application featuring a **Laravel** backend and an **Ionic/Angular** frontend.

### Project Structure
- `/backend`: Contains the Laravel backend API, database migrations, models, and controllers.
- `/frontend`: Contains the Ionic/Angular frontend application.

### Requirements
- PHP & Composer (for Backend)
- Node.js & npm (for Frontend)
- MySQL/SQLite database

### Setup Instructions

#### 1. Backend Setup (Laravel)
```bash
cd backend
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate
php artisan serve
```

#### 2. Frontend Setup (Ionic/Angular)
```bash
cd frontend
npm install
ionic serve
```

### Environment Configuration
Make sure to configure the correct API URL and Firebase credentials in the frontend environment files (`frontend/src/environments/environment.ts`) to match your backend and Firebase project settings.

---

## 🇮🇩 Versi Bahasa Indonesia

Zelive adalah aplikasi web full-stack yang menggunakan backend **Laravel** dan frontend **Ionic/Angular**.

### Struktur Project
- `/backend`: Berisi API backend Laravel, migrasi database, model, dan controller.
- `/frontend`: Berisi aplikasi frontend Ionic/Angular.

### Persyaratan Sistem
- PHP & Composer (untuk Backend)
- Node.js & npm (untuk Frontend)
- Database MySQL/SQLite

### Panduan Instalasi

#### 1. Instalasi Backend (Laravel)
```bash
cd backend
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate
php artisan serve
```

#### 2. Instalasi Frontend (Ionic/Angular)
```bash
cd frontend
npm install
ionic serve
```

### Konfigurasi Environment (Lingkungan)
Pastikan untuk mengatur URL API dan kredensial Firebase yang benar pada file environment frontend (`frontend/src/environments/environment.ts`) agar sesuai dengan pengaturan backend dan project Firebase Anda.

---
**License**
Proprietary
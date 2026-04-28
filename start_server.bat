@echo off
echo ========================================
echo Starting E-Katalog Backend Server
echo ========================================
echo.
echo Server akan berjalan di: http://localhost:8000
echo API Endpoint: http://localhost:8000/api.php
echo.
echo Tekan Ctrl+C untuk menghentikan server
echo ========================================
echo.

cd backend
php -S localhost:8000

pause

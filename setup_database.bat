@echo off
echo ========================================
echo Setup Database E-Katalog
echo ========================================
echo.

REM Cek apakah PHP tersedia
where php >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ❌ PHP tidak ditemukan!
    echo.
    echo Silakan install PHP terlebih dahulu:
    echo 1. Download dari https://www.php.net/downloads
    echo 2. Atau install XAMPP/WAMP
    echo 3. Tambahkan PHP ke PATH
    echo.
    pause
    exit /b 1
)

echo ✓ PHP ditemukan
echo.
echo Menjalankan setup database...
echo.

php backend/init_db.php

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ========================================
    echo ✅ Setup berhasil!
    echo ========================================
    echo.
    echo Langkah selanjutnya:
    echo 1. Jalankan: start_server.bat
    echo 2. Buka: frontend/index.html di browser
    echo.
) else (
    echo.
    echo ❌ Setup gagal! Lihat error di atas.
    echo.
)

pause

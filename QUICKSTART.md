# 🚀 Quick Start - E-Katalog Kantin

Panduan cepat untuk menjalankan aplikasi dalam 3 langkah!

## ⚡ Langkah Cepat (Windows)

### 1️⃣ Setup Database
```bash
setup_database.bat
```
Script ini akan otomatis:
- ✅ Membuat database SQLite
- ✅ Membuat tabel-tabel yang diperlukan
- ✅ Mengisi data sample (4 produk, 3 kategori)
- ✅ Membuat folder uploads

### 2️⃣ Jalankan Server
```bash
start_server.bat
```
Server akan berjalan di: **http://localhost:8000**

### 3️⃣ Buka Aplikasi
Double-click file: **`frontend/index.html`**

---

## 🐧 Untuk Linux/Mac

### 1️⃣ Setup Database
```bash
php backend/init_db.php
```

### 2️⃣ Jalankan Server
```bash
cd backend
php -S localhost:8000
```

### 3️⃣ Buka Aplikasi
```bash
open frontend/index.html
# atau
xdg-open frontend/index.html  # Linux
```

---

## ✅ Verifikasi

Setelah setup, cek apakah berhasil:

1. **Buka di browser:** http://localhost:8000/api.php?action=fetchKategori
   
   Seharusnya muncul JSON seperti ini:
   ```json
   [
     {"id_kategori":1,"jenis_kategori":"Makanan",...},
     {"id_kategori":2,"jenis_kategori":"Minuman",...},
     {"id_kategori":3,"jenis_kategori":"Snack",...}
   ]
   ```

2. **Buka frontend** dan seharusnya muncul 4 produk sample

---

## 🎯 Fitur yang Bisa Dicoba

- ✅ **Lihat produk** - Scroll di halaman utama
- ✅ **Tambah produk** - Klik tombol "Add Produk"
- ✅ **Edit produk** - Klik tombol "Edit" pada card produk
- ✅ **Hapus produk** - Klik tombol "Hapus" pada card produk
- ✅ **Upload gambar** - Pilih file atau gunakan kamera

---

## ❓ Troubleshooting Cepat

### PHP tidak ditemukan
```bash
# Install PHP atau tambahkan ke PATH
# Atau gunakan XAMPP/WAMP
```

### Port 8000 sudah digunakan
```bash
# Ganti port di start_server.bat:
php -S localhost:8080

# Update juga di frontend/js/api.js:
const API_BASE = 'http://localhost:8080/api.php';
```

### Database error
```bash
# Hapus database lama dan setup ulang:
del data\e_katalog.db
setup_database.bat
```

---

## 📚 Dokumentasi Lengkap

- **Instalasi detail:** Lihat `INSTALL.md`
- **Panduan penggunaan:** Lihat `README.md`
- **Struktur database:** Lihat `setup_sqlite.sql`

---

## 🎉 Selamat!

Aplikasi E-Katalog Kantin sudah siap digunakan!

**URL Penting:**
- Frontend: `frontend/index.html`
- Backend API: `http://localhost:8000/api.php`
- Upload folder: `backend/uploads/`
- Database: `data/e_katalog.db`

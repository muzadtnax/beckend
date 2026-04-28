# 📦 Panduan Instalasi E-Katalog Kantin

## Prasyarat

Pastikan sudah terinstall:
- ✅ PHP 7.4 atau lebih tinggi
- ✅ SQLite3 (opsional, untuk command line)
- ✅ Web browser modern (Chrome, Firefox, Edge)

## 🚀 Langkah Instalasi

### Metode 1: Otomatis (Windows)

1. **Setup Database**
   ```bash
   setup_database.bat
   ```
   Script ini akan otomatis membuat database SQLite di folder `data/`

2. **Jalankan Server**
   ```bash
   start_server.bat
   ```
   Server akan berjalan di `http://localhost:8000`

3. **Buka Aplikasi**
   - Buka file `frontend/index.html` di browser
   - Atau gunakan Live Server di VS Code

### Metode 2: Manual

#### 1. Setup Database SQLite

**Opsi A: Menggunakan SQLite3 Command Line**
```bash
sqlite3 data/e_katalog.db < setup_sqlite.sql
```

**Opsi B: Manual (jika sqlite3 tidak tersedia)**
1. Download SQLite dari https://www.sqlite.org/download.html
2. Extract file `sqlite3.exe`
3. Buka Command Prompt di folder project
4. Jalankan:
   ```bash
   sqlite3.exe data/e_katalog.db
   ```
5. Copy-paste seluruh isi file `setup_sqlite.sql`
6. Ketik `.quit` untuk keluar

**Opsi C: Menggunakan DB Browser for SQLite (GUI)**
1. Download dari https://sqlitebrowser.org/
2. Buka aplikasi
3. Klik "New Database" → Simpan sebagai `data/e_katalog.db`
4. Klik tab "Execute SQL"
5. Copy-paste isi `setup_sqlite.sql`
6. Klik "Execute" (ikon play)
7. Save database

#### 2. Jalankan PHP Server

Dari root folder project:
```bash
cd backend
php -S localhost:8000
```

Atau dari root folder:
```bash
php -S localhost:8000 -t backend
```

#### 3. Buka Frontend

**Opsi A: Langsung buka file**
- Double-click `frontend/index.html`

**Opsi B: Menggunakan Live Server (VS Code)**
1. Install extension "Live Server"
2. Klik kanan pada `frontend/index.html`
3. Pilih "Open with Live Server"

**Opsi C: Menggunakan Python HTTP Server**
```bash
cd frontend
python -m http.server 3000
```
Buka `http://localhost:3000`

## ✅ Verifikasi Instalasi

1. **Cek Database**
   ```bash
   sqlite3 data/e_katalog.db "SELECT * FROM tb_kategori;"
   ```
   Seharusnya menampilkan 3 kategori: Makanan, Minuman, Snack

2. **Cek Backend API**
   Buka di browser: `http://localhost:8000/api.php?action=fetchKategori`
   
   Seharusnya menampilkan JSON:
   ```json
   [
     {"id_kategori":1,"jenis_kategori":"Makanan","created_at":"..."},
     {"id_kategori":2,"jenis_kategori":"Minuman","created_at":"..."},
     {"id_kategori":3,"jenis_kategori":"Snack","created_at":"..."}
   ]
   ```

3. **Cek Frontend**
   - Buka `frontend/index.html`
   - Seharusnya menampilkan 4 produk sample
   - Coba klik "Add Produk" untuk menambah produk baru

## 🔧 Troubleshooting

### Error: "Unable to open database file"
**Solusi:**
- Pastikan folder `data/` ada
- Pastikan file `data/e_katalog.db` ada
- Cek permission folder (harus bisa write)

### Error: "PHP command not found"
**Solusi:**
- Install PHP dari https://www.php.net/downloads
- Atau gunakan XAMPP/WAMP yang sudah include PHP
- Tambahkan PHP ke PATH environment variable

### Error: "Failed to connect to localhost:8000"
**Solusi:**
- Pastikan PHP server sudah berjalan
- Cek port 8000 tidak digunakan aplikasi lain
- Coba ganti port: `php -S localhost:8080 -t backend`
- Update `API_BASE` di `frontend/js/api.js` ke port baru

### Gambar tidak muncul
**Solusi:**
- Pastikan folder `backend/uploads/` ada dan bisa write
- Cek path gambar: `http://localhost:8000/uploads/{filename}`
- Buka browser console (F12) untuk lihat error

### CORS Error
**Solusi:**
- Pastikan backend berjalan di `http://localhost:8000`
- Jangan buka frontend dengan `file://` protocol
- Gunakan Live Server atau HTTP server

## 📱 Akses dari Perangkat Lain (Opsional)

Untuk akses dari HP/tablet di jaringan yang sama:

1. Cari IP komputer Anda:
   ```bash
   ipconfig
   ```
   Cari "IPv4 Address", misal: `192.168.1.100`

2. Jalankan server dengan IP:
   ```bash
   php -S 0.0.0.0:8000 -t backend
   ```

3. Update `API_BASE` di `frontend/js/api.js`:
   ```javascript
   const API_BASE = 'http://192.168.1.100:8000/api.php';
   const UPLOAD_BASE = 'http://192.168.1.100:8000/uploads';
   ```

4. Akses dari perangkat lain:
   - Backend: `http://192.168.1.100:8000`
   - Frontend: `http://192.168.1.100:3000` (jika pakai HTTP server)

## 🎉 Selesai!

Aplikasi E-Katalog Kantin siap digunakan!

Untuk panduan penggunaan, lihat file `README.md`

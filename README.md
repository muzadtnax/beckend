# E-Katalog Kantin

Aplikasi katalog produk kantin berbasis web dengan PHP backend dan vanilla JavaScript frontend.

## 📋 Fitur

- ✅ Tampil daftar produk dengan kategori
- ✅ Tambah produk baru
- ✅ Edit produk
- ✅ Hapus produk
- ✅ Upload gambar produk
- ✅ Filter berdasarkan kategori
- ✅ Responsive design dengan Bootstrap 5

## 🛠️ Teknologi

**Backend:**
- PHP 7.4+
- SQLite Database
- RESTful API

**Frontend:**
- HTML5
- CSS3 (Bootstrap 5)
- Vanilla JavaScript
- Fetch API

## 📦 Struktur Folder

```
.
├── backend/
│   ├── api.php           # REST API endpoint
│   └── uploads/          # Folder upload gambar (auto-created)
├── data/
│   └── e_katalog.db      # SQLite database
├── frontend/
│   ├── index.html        # Halaman utama
│   ├── add.html          # Halaman tambah produk
│   ├── update.html       # Halaman edit produk
│   ├── css/
│   │   └── style.css     # Custom styles
│   ├── js/
│   │   └── api.js        # API handler
│   └── images/           # Asset gambar
├── setup_sqlite.sql      # SQL setup untuk SQLite
└── README.md
```

## 🚀 Cara Menjalankan

### 1. Setup Database

Jalankan perintah berikut untuk membuat database SQLite:

```bash
sqlite3 data/e_katalog.db < setup_sqlite.sql
```

**Atau** jika sqlite3 tidak tersedia di command line, gunakan cara manual:

```bash
# Buka SQLite
sqlite3 data/e_katalog.db

# Copy-paste isi file setup_sqlite.sql
# Lalu ketik:
.quit
```

### 2. Jalankan PHP Server

Dari root folder project:

```bash
php -S localhost:8000 -t backend
```

Server akan berjalan di `http://localhost:8000`

### 3. Buka Frontend

Buka file `frontend/index.html` di browser, atau gunakan Live Server:

```bash
# Jika menggunakan Python
cd frontend
python -m http.server 3000

# Atau gunakan VS Code Live Server extension
```

Akses aplikasi di browser:
- Frontend: `http://localhost:3000` (atau buka langsung index.html)
- Backend API: `http://localhost:8000/api.php`

## 📡 API Endpoints

### GET Requests

- `GET /api.php?action=fetchKategori` - Ambil semua kategori
- `GET /api.php?action=fetchProduk` - Ambil semua produk
- `GET /api.php?action=fetchProdukById&id={id}` - Ambil produk berdasarkan ID

### POST Requests

- `POST /api.php?action=addProduk` - Tambah produk baru
- `POST /api.php?action=updateProduk&id={id}` - Update produk

### DELETE Requests

- `DELETE /api.php?action=deleteProduk&id={id}` - Hapus produk

## 📝 Contoh Request

### Tambah Produk (FormData)

```javascript
const formData = new FormData();
formData.append('nama_produk', 'Nasi Goreng');
formData.append('harga', 15000);
formData.append('stok', 20);
formData.append('deskripsi', 'Nasi goreng spesial');
formData.append('kategori_id', 1);
formData.append('gambar', fileInput.files[0]);

fetch('http://localhost:8000/api.php?action=addProduk', {
  method: 'POST',
  body: formData
});
```

## 🔧 Troubleshooting

### Database tidak terbuat
- Pastikan folder `data/` ada
- Pastikan SQLite terinstall
- Coba buat database manual dengan sqlite3

### Upload gambar gagal
- Pastikan folder `backend/uploads/` memiliki permission write
- Cek ukuran file tidak melebihi `upload_max_filesize` di php.ini

### CORS Error
- Pastikan backend berjalan di port 8000
- Cek CORS headers di `api.php` sudah benar

### Gambar tidak muncul
- Pastikan path gambar benar: `http://localhost:8000/uploads/{filename}`
- Cek file gambar ada di folder `backend/uploads/`

## 📄 License

MIT License - Bebas digunakan untuk keperluan pembelajaran dan komersial.

## 👨‍💻 Developer

Dibuat untuk project E-Katalog Kantin

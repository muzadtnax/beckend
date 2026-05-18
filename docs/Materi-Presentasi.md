# Materi Presentasi E-Katalog Kantin

## Slide 1: Judul

```
========================================
        E-KATALOG KANTIN
========================================
    Aplikasi Katalog Produk Digital
    
    Solusi Modern untuk Pengelolaan
    Produk Kantin
    
    --------------------------------
    Tahun: 2026
    Teknologi: PHP, SQLite, JavaScript
========================================
```

---

## Slide 2: Latar Belakang

### Masalah yang Dihadapi
- Pencatatan produk kantin masih manual (buku/catatan)
- Sulit mencari informasi produk tertentu
- Data harga dan stok sering tidak akurat
- Tidak ada visualisasi gambar produk
- Proses update data memakan waktu lama

### Solusi
Aplikasi E-Katalog berbasis web yang memungkinkan:
- Pencatatan produk secara digital
- Pencarian dan filter produk dengan mudah
- Upload gambar produk
- Update data secara real-time

---

## Slide 3: Tujuan Aplikasi

### Tujuan Utama
1. **Efisiensi** - Mempercepat proses pencatatan dan pencarian produk
2. **Akurasi** - Memastikan data harga dan stok selalu terbaru
3. **Visualisasi** - Menampilkan gambar produk untuk memudahkan identifikasi
4. **Aksesibilitas** - Dapat diakses dari berbagai perangkat

### Manfaat
- Menghemat waktu pencatatan
- Mengurangi kesalahan data
- Memudahkan pengambilan keputusan
- Profesionalisme pengelolaan kantin

---

## Slide 4: Teknologi yang Digunakan

```
+--------------------------------------------------+
|                   E-KATALOG                       |
+--------------------------------------------------+
|                                                  |
|  FRONTEND            BACKEND           DATABASE  |
|  =========            =======           ========  |
|  HTML5               PHP 7.4+          SQLite    |
|  CSS3                RESTful API                 |
|  Bootstrap 5         File Upload                 |
|  JavaScript          CORS Support                |
|                                                  |
+--------------------------------------------------+
|               ARSITEKTUR APLIKASI                |
+--------------------------------------------------+
```

### Keunggulan Teknologi
- **PHP**: Bahasa server-side yang mudah dipelajari
- **SQLite**: Database ringan, tidak perlu server terpisah
- **Bootstrap 5**: Framework CSS responsif
- **Vanilla JavaScript**: Tanpa dependency library

---

## Slide 5: Fitur Utama

### 1. Manajemen Produk
- Tambah produk baru
- Edit produk yang sudah ada
- Hapus produk
- Upload gambar dengan crop

### 2. Kategorisasi
- 3 kategori: Makanan, Minuman, Snack
- Filter produk berdasarkan kategori
- Counter jumlah produk

### 3. Tampilan Responsif
- Desktop, tablet, dan mobile
- Dark theme modern
- Animasi dan transisi halus

### 4. Keamanan
- API Key authentication
- CORS protection
- Input validation

---

## Slide 6: Halaman Utama

```
+----------------------------------------------------------+
|  [Logo] E-Katalog Kantin    [Semua Kategori v] [+Tambah] |
+----------------------------------------------------------+
|                                                          |
|  Semua Produk                              4 Produk      |
|                                                          |
|  [Makanan] [Minuman] [Snack] [Semua]                     |
|                                                          |
|  +-----------+  +-----------+  +-----------+             |
|  | [Gambar]  |  | [Gambar]  |  | [Gambar]  |             |
|  | Nama      |  | Nama      |  | Nama      |             |
|  | Stok: 20  |  | Stok: 15  |  | Stok: 30  |             |
|  | Rp15.000  |  | Rp8.000   |  | Rp12.000  |             |
|  | [Detail]🗑|  | [Detail]🗑|  | [Detail]🗑|             |
|  +-----------+  +-----------+  +-----------+             |
|                                                          |
+----------------------------------------------------------+
```

### Fitur Halaman Utama
- Grid layout responsif (2-4 kolom)
- Hover effect pada kartu produk
- Filter kategori dengan pills
- Dropdown kategori di navbar

---

## Slide 7: Menambah Produk

### Alur Kerja
```
[Klik Tambah] → [Isi Form] → [Upload Gambar] → [Crop] → [Simpan]
```

### Form yang Tersedia
| Field | Keterangan |
|-------|------------|
| Gambar | Upload dari file/kamera |
| Nama | Nama produk (wajib) |
| Stok | Jumlah stok (angka) |
| Harga | Harga dalam Rupiah |
| Kategori | Makanan/Minuman/Snack |
| Deskripsi | Keterangan produk |

### Fitur Upload Gambar
- Pilih dari file komputer
- Ambil dari kamera
- Crop dan rotate gambar
- Zoom in/out

---

## Slide 8: Melihat Detail

### Modal Detail Produk
```
+------------------------------------------+
|         [Gambar Produk]                  |
|                                          |
|  Nama: Nasi Goreng Spesial               |
|  [Makanan]                               |
|                                          |
|  Harga: Rp15.000                         |
|  Stok: 20                                |
|                                          |
|  Deskripsi:                              |
|  Nasi goreng dengan bumbu spesial...     |
|                                          |
|  [Edit]              [Tutup]             |
+------------------------------------------+
```

### Informasi yang Ditampilkan
- Gambar ukuran besar
- Nama dan kategori
- Harga format Rupiah
- Stok tersedia
- Deskripsi lengkap
- Tanggal dibuat/update

---

## Slide 9: Mengedit & Menghapus

### Edit Produk
1. Buka halaman edit (via Detail atau URL)
2. Form terisi otomatis dengan data lama
3. Ubah data yang diperlukan
4. Klik "Update Produk"
5. Konfirmasi berhasil → redirect ke halaman utama

### Hapus Produk
1. Klik ikon tempat sampah pada kartu
2. Dialog konfirmasi muncul
3. Klik "Ya, hapus!"
4. Produk dihapus permanen

### Catatan
- Edit: Data lama dipertahankan jika tidak diubah
- Hapus: Tidak bisa dikembalikan

---

## Slide 10: Filter Kategori

### Cara Filter
```
[Makanan] [Minuman] [Snack] [Semua]
         ↓
    [Klik salah satu]
         ↓
    [Produk difilter]
```

### Fitur Filter
- Real-time filtering (tanpa reload)
- Counter produk berubah sesuai filter
- Dropdown di navbar juga bisa digunakan
- Pills di bawah header untuk akses cepat

### Kategori Default
| ID | Nama | Contoh Produk |
|----|------|---------------|
| 1 | Makanan | Nasi, Mie, Ayam |
| 2 | Minuman | Jus, Kopi, Teh |
| 3 | Snack | Keripik, Roti |

---

## Slide 11: Arsitektur Sistem

```
+------------------+     HTTP/REST     +------------------+
|                  |  ←─────────────→  |                  |
|    FRONTEND      |                   |     BACKEND      |
|    (Browser)     |                   |     (PHP)        |
|                  |                   |                  |
|  - HTML/CSS/JS   |                   |  - api.php       |
|  - Bootstrap 5   |                   |  - File Upload   |
|  - Fetch API     |                   |  - Validation    |
|                  |                   |                  |
+------------------+                   +------------------+
                                               |
                                               ↓
                                       +------------------+
                                       |                  |
                                       |    DATABASE      |
                                       |    (SQLite)      |
                                       |                  |
                                       |  - tb_produk     |
                                       |  - tb_kategori   |
                                       |  - tb_relasi     |
                                       |                  |
                                       +------------------+
```

### Alur Data
1. User berinteraksi dengan Frontend
2. Frontend mengirim request ke Backend (API)
3. Backend memproses data dan mengakses Database
4. Database mengembalikan hasil query
5. Backend mengirim response ke Frontend
6. Frontend menampilkan data ke User

---

## Slide 12: Database Schema

### Tabel Produk (tb_produk)
```sql
CREATE TABLE tb_produk (
    id_produk    INTEGER PRIMARY KEY AUTOINCREMENT,
    nama_produk  TEXT NOT NULL,
    harga        REAL NOT NULL,
    stok         INTEGER NOT NULL,
    deskripsi    TEXT,
    gambar       TEXT,
    created_at   DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at   DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### Tabel Kategori (tb_kategori)
```sql
CREATE TABLE tb_kategori (
    id_kategori     INTEGER PRIMARY KEY AUTOINCREMENT,
    jenis_kategori  TEXT NOT NULL,
    created_at      DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### Tabel Relasi (tb_produk_kategori)
```sql
CREATE TABLE tb_produk_kategori (
    id_produk   INTEGER,
    id_kategori INTEGER,
    FOREIGN KEY (id_produk) REFERENCES tb_produk(id_produk),
    FOREIGN KEY (id_kategori) REFERENCES tb_kategori(id_kategori)
);
```

---

## Slide 13: API Endpoints

### Daftar API

| Method | Endpoint | Fungsi |
|--------|----------|--------|
| GET | `/api.php?action=fetchProduk` | Ambil semua produk |
| GET | `/api.php?action=fetchKategori` | Ambil semua kategori |
| GET | `/api.php?action=fetchProdukById&id={id}` | Ambil produk by ID |
| POST | `/api.php?action=addProduk` | Tambah produk |
| POST | `/api.php?action=updateProduk&id={id}` | Update produk |
| DELETE | `/api.php?action=deleteProduk&id={id}` | Hapus produk |

### Keamanan API
- API Key authentication
- CORS protection
- Input validation
- SQL injection prevention (prepared statements)

---

## Slide 14: Demo Aplikasi

### Skenario Demo

1. **Buka Halaman Utama**
   - Tampilkan daftar produk
   - Filter berdasarkan kategori

2. **Tambah Produk Baru**
   - Isi form
   - Upload gambar
   - Simpan dan lihat hasilnya

3. **Edit Produk**
   - Buka detail produk
   - Edit beberapa field
   - Update dan lihat perubahan

4. **Hapus Produk**
   - Hapus produk yang sudah ada
   - Konfirmasi penghapusan

5. **Filter Kategori**
   - Filter berdasarkan Makanan
   - Filter berdasarkan Minuman
   - Kembali ke Semua

---

## Slide 15: Keunggulan Aplikasi

### Dari Sisi Teknis
- Responsive design (mobile-friendly)
- Dark theme modern
- Animasi dan transisi halus
- Image cropping dan processing
- Real-time validation

### Dari Sisi Fungsional
- CRUD lengkap (Create, Read, Update, Delete)
- Kategorisasi produk
- Upload gambar dari file/kamera
- Format harga otomatis
- Counter produk dinamis

### Dari Sisi Keamanan
- API Key authentication
- CORS protection
- Input sanitization
- SQL injection prevention
- File upload validation

---

## Slide 16: Tantangan & Solusi

### Tantangan yang Dihadapi

| Tantangan | Solusi |
|-----------|--------|
| Upload gambar | Implementasi cropper.js untuk crop gambar |
| Format harga | JavaScript auto-format titik ribuan |
| Responsive design | Bootstrap 5 grid system |
| Dark theme | CSS variables dan custom styling |
| API security | API Key + CORS + validation |

### Pelajaran yang Dipelajari
- Pentingnya validasi input
- Manajemen state dalam JavaScript
- Best practices RESTful API
- Responsive design principles

---

## Slide 17: Pengembangan ke Depan

### Fitur yang Bisa Ditambahkan
1. **Autentikasi User** - Login dan registrasi
2. **Pencarian Produk** - Search bar dengan filter
3. **Riwayat Perubahan** - Log aktivitas
4. **Export Data** - Export ke Excel/PDF
5. **Multi-upload** - Upload beberapa gambar
6. **Rating & Review** - Sistem penilaian produk
7. **Integrasi Pembayaran** - QRIS atau e-wallet
8. **Notifikasi** - Stok hampir habis

### Optimasi yang Bisa Dilakukan
- Implementasi caching
- Lazy loading gambar
- PWA (Progressive Web App)
- CDN untuk static assets

---

## Slide 18: Kesimpulan

### Ringkasan
E-Katalog Kantin adalah aplikasi web yang berhasil dibangun untuk:
- Mengelola data produk kantin secara digital
- Menampilkan katalog produk dengan gambar
- Memudahkan proses CRUD produk
- Menyediakan filter berdasarkan kategori

### Pencapaian
- Semua fitur utama berhasil diimplementasikan
- Aplikasi responsif dan user-friendly
- Keamanan dasar sudah diterapkan
- Dokumentasi lengkap tersedia

### Manfaat
- Efisiensi pengelolaan produk
- Akurasi data yang lebih baik
- Kemudahan akses informasi
- Profesionalisme pengelolaan kantin

---

## Slide 19: Q&A

```
========================================
           TERIMA KASIH
========================================

        Pertanyaan & Jawaban
        
    --------------------------------
    
    Aplikasi ini dibuat dengan:
    - PHP 7.4+
    - SQLite
    - Bootstrap 5
    - Vanilla JavaScript
    
    --------------------------------
    
    Dokumentasi lengkap tersedia di:
    - README.md
    - INSTALL.md
    - User-Guide.md
    
========================================
```

---

## Slide 20: Penutup

```
========================================
           E-KATALOG KANTIN
========================================
    
    Aplikasi Katalog Produk Digital
    
    Terima kasih atas perhatiannya!
    
    --------------------------------
    
    Kontak Developer:
    [Tambahkan kontak jika diperlukan]
    
    Repository:
    [Tambahkan link repository jika ada]
    
========================================
```

---

## Catatan Presenter

### Tips Presentasi

1. **Persiapan**
   - Pastikan aplikasi sudah running
   - Siapkan data contoh yang menarik
   - Test semua fitur sebelum presentasi

2. **Saat Presentasi**
   - Mulai dengan latar belakang masalah
   - Tunjukkan demo langsung
   - Jelaskan teknologi yang digunakan
   - Akhiri dengan Q&A

3. **Demo yang Disarankan**
   - Buka halaman utama
   - Filter kategori
   - Tambah produk baru dengan gambar
   - Edit produk
   - Hapus produk
   - Tampilkan di mobile view

4. **Waktu yang Dibutuhkan**
   - Slide 1-4: 5 menit (Pendahuluan)
   - Slide 5-10: 10 menit (Fitur)
   - Slide 11-13: 5 menit (Teknis)
   - Demo: 10 menit
   - Slide 14-20: 5 menit (Kesimpulan)
   - Q&A: 10 menit
   - **Total: 45 menit**

---

*Dokumen ini disusun untuk keperluan presentasi akhir project E-Katalog Kantin.*

*Terakhir diperbarui: 18 Mei 2026*

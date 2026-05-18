# Panduan Pengguna E-Katalog Kantin

## Daftar Isi

1. [Pendahuluan](#1-pendahuluan)
2. [Memulai Aplikasi](#2-memulai-aplikasi)
3. [Halaman Utama - Daftar Produk](#3-halaman-utama---daftar-produk)
4. [Menambah Produk Baru](#4-menambah-produk-baru)
5. [Melihat Detail Produk](#5-melihat-detail-produk)
6. [Mengedit Produk](#6-mengedit-produk)
7. [Menghapus Produk](#7-menghapus-produk)
8. [Filter Berdasarkan Kategori](#8-filter-berdasarkan-kategori)
9. [Tips & Trik](#9-tips--trik)
10. [Troubleshooting](#10-troubleshooting)

---

## 1. Pendahuluan

**E-Katalog Kantin** adalah aplikasi katalog produk digital yang dirancang untuk memudahkan pengelolaan data produk kantin. Aplikasi ini memungkinkan pengguna untuk:

- Melihat daftar produk lengkap dengan gambar, harga, dan stok
- Menambah, mengedit, dan menghapus produk
- Mengelompokkan produk berdasarkan kategori (Makanan, Minuman, Snack)
- Mengupload dan mengelola gambar produk

### Teknologi yang Digunakan

| Komponen | Teknologi |
|----------|-----------|
| Frontend | HTML5, CSS3, Bootstrap 5, JavaScript |
| Backend | PHP 7.4+ |
| Database | SQLite |
| API | RESTful API |

---

## 2. Memulai Aplikasi

### Prasyarat
- PHP 7.4 atau lebih tinggi
- Web browser modern (Chrome, Firefox, Edge)
- Koneksi internet (untuk memuat Bootstrap CDN)

### Langkah Memulai

#### Metode 1: Menggunakan Batch Script (Windows)

1. **Setup Database**
   ```
   Klik dua kali file setup_database.bat
   ```

2. **Jalankan Server**
   ```
   Klik dua kali file start_server.bat
   ```

3. **Buka Aplikasi**
   - Buka file `frontend/index.html` di browser
   - Atau buka `http://localhost:3000` jika menggunakan Live Server

#### Metode 2: Manual

1. Buka Command Prompt di folder project
2. Jalankan perintah:
   ```bash
   php -S localhost:8000 -t backend
   ```
3. Buka `frontend/index.html` di browser

---

## 3. Halaman Utama - Daftar Produk

Halaman utama menampilkan semua produk yang tersedia dalam bentuk kartu (card).

### Elemen Halaman Utama

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
|  E-Katalog Kantin - 2024                                 |
+----------------------------------------------------------+
```

### Fitur yang Tersedia

| Elemen | Fungsi |
|--------|--------|
| **Navbar** | Navigasi utama, filter kategori, tombol tambah produk |
| **Kartu Produk** | Menampilkan gambar, nama, stok, harga, dan aksi |
| **Tombol Detail** | Melihat informasi lengkap produk |
| **Tombol Hapus** | Menghapus produk dari database |
| **Pills Kategori** | Filter produk berdasarkan kategori |
| **Counter Produk** | Menampilkan jumlah produk yang ditampilkan |

---

## 4. Menambah Produk Baru

### Langkah-langkah

1. **Klik tombol "Tambah Produk"** di pojok kanan atas navbar

2. **Isi Formulir Produk:**
   - **Gambar Produk** - Upload gambar dari file atau kamera
   - **Nama Produk** - Nama produk (wajib)
   - **Stok** - Jumlah stok tersedia (wajib, angka)
   - **Harga** - Harga dalam Rupiah (wajib, angka)
   - **Kategori** - Pilih kategori: Makanan/Minuman/Snack (wajib)
   - **Deskripsi** - Deskripsi produk (opsional)

3. **Klik "Simpan Produk"**

### Upload Gambar

Terdapat 3 cara untuk menambahkan gambar:

#### Cara 1: Pilih dari File
1. Klik area upload gambar atau tombol "Pilih File"
2. Pilih file gambar dari komputer
3. Akan muncul modal crop untuk menyesuaikan gambar
4. Klik "Konfirmasi" untuk menyimpan

#### Cara 2: Ambil dari Kamera
1. Klik tombol "Kamera" (ikon kamera)
2. Arahkan kamera ke produk
3. Klik "Ambil Foto"
4. Sesuaikan gambar di modal crop
5. Klik "Konfirmasi"

#### Cara 3: Tanpa Gambar
- Produk akan menggunakan gambar default (logo)

### Validasi Form

| Field | Validasi |
|-------|----------|
| Nama Produk | Tidak boleh kosong |
| Stok | Harus angka bulat positif |
| Harga | Harus angka positif |
| Kategori | Harus dipilih |

Jika ada field yang tidak valid, akan muncul pesan error berwarna merah.

---

## 5. Melihat Detail Produk

### Langkah-langkah

1. **Klik tombol "Detail"** pada kartu produk
2. **Modal detail akan muncul** menampilkan:
   - Gambar produk (ukuran besar)
   - Nama produk
   - Kategori
   - Harga (format Rupiah)
   - Stok tersedia
   - Deskripsi lengkap
   - Tanggal dibuat & diupdate

3. **Klik tombol "Edit"** untuk langsung ke halaman edit
4. **Klik tombol "Tutup"** atau klik di luar modal untuk menutup

### Tampilan Modal Detail

```
+------------------------------------------+
|  +------------------------------------+  |
|  |                                    |  |
|  |         [Gambar Produk]            |  |
|  |                                    |  |
|  +------------------------------------+  |
|                                          |
|  Nama Produk: Nasi Goreng Spesial        |
|  [Makanan]                               |
|                                          |
|  Harga                                   |
|  Rp15.000                                |
|                                          |
|  Stok tersedia: 20                       |
|                                          |
|  Deskripsi                               |
|  Nasi goreng dengan bumbu spesial...     |
|                                          |
|  Dibuat: 18/05/2026                      |
|  Diupdate: 18/05/2026                    |
|                                          |
|  [Edit]              [Tutup]             |
+------------------------------------------+
```

---

## 6. Mengedit Produk

### Langkah-langkah

1. **Buka halaman edit** dengan salah satu cara:
   - Klik tombol "Detail" → Klik tombol "Edit"
   - Atau buka langsung: `update.html?id={id_produk}`

2. **Form edit akan terisi otomatis** dengan data produk

3. **Ubah data yang diinginkan**

4. **Untuk mengubah gambar:**
   - Klik ikon edit pada gambar
   - Pilih gambar baru atau ambil dari kamera
   - Crop gambar sesuai keinginan

5. **Klik "Update Produk"** untuk menyimpan perubahan

6. **Konfirmasi berhasil** - akan redirect ke halaman utama

### Catatan Penting

- Jika tidak mengubah gambar, gambar lama akan tetap digunakan
- Semua field wajib harus terisi sebelum bisa update
- Harga dan stok harus berupa angka

---

## 7. Menghapus Produk

### Langkah-langkah

1. **Klik tombol hapus** (ikon tempat sampah) pada kartu produk
2. **Konfirmasi penghapusan** - akan muncul dialog konfirmasi
3. **Klik "Ya, hapus!"** untuk menghapus
4. **Produk berhasil dihapus** - halaman akan refresh otomatis

### Peringatan

- Produk yang sudah dihapus **tidak bisa dikembalikan**
- Gambar produk juga akan dihapus dari server
- Pastikan sebelum menghapus, produk memang sudah tidak diperlukan

---

## 8. Filter Berdasarkan Kategori

### Menggunakan Pills Kategori

Di bawah header halaman, terdapat tombol-tombol kategori:

```
[Makanan]  [Minuman]  [Snack]  [Semua]
```

- **Klik "Semua"** - Menampilkan semua produk
- **Klik "Makanan"** - Hanya menampilkan produk makanan
- **Klik "Minuman"** - Hanya menampilkan produk minuman
- **Klik "Snack"** - Hanya menampilkan produk snack

### Menggunakan Dropdown

1. **Klik dropdown "Semua Kategori"** di navbar
2. **Pilih kategori** yang diinginkan
3. **Produk akan difilter** sesuai kategori

### Counter Produk

Jumlah produk yang ditampilkan akan berubah sesuai filter:
- "Semua Produk" - Semua produk
- "Makanan" - Hanya produk makanan
- dst.

---

## 9. Tips & Trik

### Shortcut Keyboard

| Shortcut | Fungsi |
|----------|--------|
| `Tab` | Pindah ke field berikutnya |
| `Shift + Tab` | Pindah ke field sebelumnya |
| `Enter` | Submit form |

### Tips Penggunaan

1. **Gambar Produk**
   - Gunakan gambar dengan rasio 1:1 (persegi) untuk hasil terbaik
   - Ukuran maksimal disarankan 800x800 pixel
   - Format yang didukung: JPG, PNG, WebP, GIF

2. **Harga**
   - Masukkan angka tanpa titik atau koma
   - Sistem akan otomatis menambahkan format titik (contoh: 15000 → 15.000)

3. **Stok**
   - Masukkan angka bulat
   - Tidak bisa menggunakan desimal

4. **Pencarian**
   - Gunakan filter kategori untuk menemukan produk lebih cepat

### Best Practices

- **Backup database** secara berkala (file `data/e_katalog.db`)
- **Gunakan gambar berkualitas** tapi tidak terlalu besar (maks 2MB)
- **Isi deskripsi** dengan lengkap untuk memudahkan pencarian
- **Periksa stok** secara berkala agar data selalu akurat

---

## 10. Troubleshooting

### Masalah Umum

#### Gambar tidak muncul setelah upload
**Penyebab:** File gambar gagal diupload atau path salah
**Solusi:**
1. Cek ukuran file tidak melebihi limit PHP
2. Pastikan folder `backend/uploads/` ada dan bisa ditulis
3. Buka Console (F12) untuk melihat error

#### Form tidak bisa disubmit
**Penyebab:** Ada field wajib yang kosong atau tidak valid
**Solusi:**
1. Cek apakah ada field berwarna merah
2. Pastikan Harga dan Stok berupa angka
3. Pastikan Kategori sudah dipilih

#### Halaman loading terus
**Penyebab:** Backend server tidak berjalan
**Solusi:**
1. Pastikan PHP server sudah dijalankan
2. Cek apakah port 8000 tidak digunakan aplikasi lain
3. Buka `http://localhost:8000/api.php?action=fetchKategori` untuk test

#### Data tidak tersimpan
**Penyebab:** Koneksi ke database gagal
**Solusi:**
1. Pastikan file database ada di `data/e_katalog.db`
2. Cek permission folder `data/`
3. Restart PHP server

#### Error CORS
**Penyebab:** Frontend dan backend di domain/port berbeda
**Solusi:**
1. Pastikan backend di `http://localhost:8000`
2. Jangan buka frontend dengan `file://`
3. Gunakan Live Server atau HTTP server untuk frontend

### Cara Melihat Error

1. **Buka Developer Tools** dengan menekan `F12`
2. **Klik tab "Console"** untuk melihat error JavaScript
3. **Klik tab "Network"** untuk melihat request API
4. **Refresh halaman** dan perhatikan error yang muncul

### Kontak & Support

Jika mengalami masalah yang tidak tercantum di panduan ini:
1. Cek file `README.md` untuk informasi teknis
2. Cek file `INSTALL.md` untuk panduan instalasi
3. Hubungi tim developer untuk bantuan lebih lanjut

---

## Lampiran

### Daftar Kategori Default

| ID | Nama Kategori |
|----|---------------|
| 1  | Makanan       |
| 2  | Minuman       |
| 3  | Snack         |

### Format Data Produk

| Field | Tipe | Contoh |
|-------|------|--------|
| nama_produk | String | "Nasi Goreng" |
| harga | Integer | 15000 |
| stok | Integer | 20 |
| deskripsi | String | "Nasi goreng spesial" |
| kategori_id | Integer | 1 |
| gambar | File | gambar.jpg |

### Struktur Database

```sql
CREATE TABLE tb_produk (
    id_produk INTEGER PRIMARY KEY AUTOINCREMENT,
    nama_produk TEXT NOT NULL,
    harga REAL NOT NULL,
    stok INTEGER NOT NULL,
    deskripsi TEXT,
    gambar TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE tb_kategori (
    id_kategori INTEGER PRIMARY KEY AUTOINCREMENT,
    jenis_kategori TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE tb_produk_kategori (
    id_produk INTEGER,
    id_kategori INTEGER,
    FOREIGN KEY (id_produk) REFERENCES tb_produk(id_produk),
    FOREIGN KEY (id_kategori) REFERENCES tb_kategori(id_kategori)
);
```

---

*Dokumen ini disusun untuk keperluan presentasi dan panduan penggunaan aplikasi E-Katalog Kantin.*

*Terakhir diperbarui: 18 Mei 2026*

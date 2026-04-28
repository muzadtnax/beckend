-- Setup SQLite Database untuk E-Katalog

-- Buat tabel kategori
CREATE TABLE IF NOT EXISTS tb_kategori (
  id_kategori INTEGER PRIMARY KEY AUTOINCREMENT,
  jenis_kategori TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Buat tabel produk
CREATE TABLE IF NOT EXISTS tb_produk (
  id_produk INTEGER PRIMARY KEY AUTOINCREMENT,
  nama_produk TEXT NOT NULL,
  harga REAL NOT NULL,
  stok INTEGER NOT NULL DEFAULT 0,
  deskripsi TEXT,
  gambar TEXT DEFAULT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Buat tabel produk_kategori (junction table)
CREATE TABLE IF NOT EXISTS tb_produk_kategori (
  id_produk_kategori INTEGER PRIMARY KEY AUTOINCREMENT,
  id_produk INTEGER NOT NULL,
  id_kategori INTEGER NOT NULL,
  FOREIGN KEY (id_produk) REFERENCES tb_produk(id_produk) ON DELETE CASCADE,
  FOREIGN KEY (id_kategori) REFERENCES tb_kategori(id_kategori) ON DELETE CASCADE
);

-- Insert sample data kategori
INSERT INTO tb_kategori (jenis_kategori) VALUES 
('Makanan'),
('Minuman'),
('Snack');

-- Insert sample data produk
INSERT INTO tb_produk (nama_produk, harga, stok, deskripsi) VALUES 
('Nasi Goreng', 15000, 20, 'Nasi goreng spesial dengan telur'),
('Mie Ayam', 12000, 15, 'Mie ayam dengan bakso'),
('Es Teh Manis', 5000, 50, 'Es teh manis segar'),
('Chitato', 8000, 30, 'Keripik kentang rasa sapi panggang');

-- Insert relasi produk-kategori
INSERT INTO tb_produk_kategori (id_produk, id_kategori) VALUES 
(1, 1), -- Nasi Goreng -> Makanan
(2, 1), -- Mie Ayam -> Makanan
(3, 2), -- Es Teh -> Minuman
(4, 3); -- Chitato -> Snack

-- Buat database
CREATE DATABASE IF NOT EXISTS e_katalog;
USE e_katalog;

-- Buat tabel kategori
CREATE TABLE IF NOT EXISTS tb_kategori (
  id_kategori INT PRIMARY KEY AUTO_INCREMENT,
  jenis_kategori VARCHAR(100) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Buat tabel produk
CREATE TABLE IF NOT EXISTS tb_produk (
  id_produk INT PRIMARY KEY AUTO_INCREMENT,
  nama_produk VARCHAR(255) NOT NULL,
  harga DECIMAL(12, 2) NOT NULL,
  stok INT NOT NULL DEFAULT 0,
  deskripsi TEXT,
  gambar VARCHAR(255) DEFAULT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Buat tabel produk_kategori (junction table)
CREATE TABLE IF NOT EXISTS tb_produk_kategori (
  id_produk_kategori INT PRIMARY KEY AUTO_INCREMENT,
  id_produk INT NOT NULL,
  id_kategori INT NOT NULL,
  FOREIGN KEY (id_produk) REFERENCES tb_produk(id_produk) ON DELETE CASCADE,
  FOREIGN KEY (id_kategori) REFERENCES tb_kategori(id_kategori) ON DELETE CASCADE
);

-- Insert sample data
INSERT INTO tb_kategori (jenis_kategori) VALUES ('Makanan'), ('Minuman'), ('Lainnya');
INSERT INTO tb_produk (nama_produk, harga, stok, deskripsi) VALUES 
('Laptop HP', 5000000, 10, 'Laptop gaming HP terbaru'),
('Keyboard Mekanik', 500000, 25, 'Keyboard RGB mekanik'),
('Monitor 27 inch', 2000000, 15, 'Monitor IPS 144Hz');

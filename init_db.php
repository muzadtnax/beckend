<?php
/**
 * Script untuk inisialisasi database SQLite
 * Jalankan sekali saat pertama kali setup
 */

$dbPath = __DIR__ . '/../data/e_katalog.db';
$dbDir = dirname($dbPath);

// Buat folder data jika belum ada
if (!is_dir($dbDir)) {
    mkdir($dbDir, 0755, true);
    echo "✓ Folder data/ berhasil dibuat\n";
}

// Cek apakah database sudah ada
$dbExists = file_exists($dbPath);

try {
    // Buat koneksi ke database (akan membuat file jika belum ada)
    $db = new PDO("sqlite:$dbPath");
    $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    if (!$dbExists) {
        echo "✓ Database baru dibuat: $dbPath\n";
    } else {
        echo "✓ Database sudah ada: $dbPath\n";
    }
    
    // Buat tabel kategori
    $db->exec("CREATE TABLE IF NOT EXISTS tb_kategori (
        id_kategori INTEGER PRIMARY KEY AUTOINCREMENT,
        jenis_kategori TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )");
    echo "✓ Tabel tb_kategori berhasil dibuat\n";
    
    // Buat tabel produk
    $db->exec("CREATE TABLE IF NOT EXISTS tb_produk (
        id_produk INTEGER PRIMARY KEY AUTOINCREMENT,
        nama_produk TEXT NOT NULL,
        harga REAL NOT NULL,
        stok INTEGER NOT NULL DEFAULT 0,
        deskripsi TEXT,
        gambar TEXT DEFAULT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )");
    echo "✓ Tabel tb_produk berhasil dibuat\n";
    
    // Buat tabel produk_kategori
    $db->exec("CREATE TABLE IF NOT EXISTS tb_produk_kategori (
        id_produk_kategori INTEGER PRIMARY KEY AUTOINCREMENT,
        id_produk INTEGER NOT NULL,
        id_kategori INTEGER NOT NULL,
        FOREIGN KEY (id_produk) REFERENCES tb_produk(id_produk) ON DELETE CASCADE,
        FOREIGN KEY (id_kategori) REFERENCES tb_kategori(id_kategori) ON DELETE CASCADE
    )");
    echo "✓ Tabel tb_produk_kategori berhasil dibuat\n";
    
    // Cek apakah sudah ada data kategori
    $stmt = $db->query("SELECT COUNT(*) FROM tb_kategori");
    $count = $stmt->fetchColumn();
    
    if ($count == 0) {
        // Insert sample data kategori
        $db->exec("INSERT INTO tb_kategori (jenis_kategori) VALUES 
            ('Makanan'),
            ('Minuman'),
            ('Snack')
        ");
        echo "✓ Data kategori sample berhasil ditambahkan\n";
        
        // Insert sample data produk
        $db->exec("INSERT INTO tb_produk (nama_produk, harga, stok, deskripsi) VALUES 
            ('Nasi Goreng', 15000, 20, 'Nasi goreng spesial dengan telur'),
            ('Mie Ayam', 12000, 15, 'Mie ayam dengan bakso'),
            ('Es Teh Manis', 5000, 50, 'Es teh manis segar'),
            ('Chitato', 8000, 30, 'Keripik kentang rasa sapi panggang')
        ");
        echo "✓ Data produk sample berhasil ditambahkan\n";
        
        // Insert relasi produk-kategori
        $db->exec("INSERT INTO tb_produk_kategori (id_produk, id_kategori) VALUES 
            (1, 1),
            (2, 1),
            (3, 2),
            (4, 3)
        ");
        echo "✓ Relasi produk-kategori berhasil ditambahkan\n";
    } else {
        echo "✓ Data kategori sudah ada ($count kategori)\n";
    }
    
    // Buat folder uploads jika belum ada
    $uploadDir = __DIR__ . '/uploads';
    if (!is_dir($uploadDir)) {
        mkdir($uploadDir, 0755, true);
        echo "✓ Folder uploads/ berhasil dibuat\n";
    } else {
        echo "✓ Folder uploads/ sudah ada\n";
    }
    
    echo "\n========================================\n";
    echo "✅ Setup database berhasil!\n";
    echo "========================================\n";
    echo "Database: $dbPath\n";
    echo "Upload folder: $uploadDir\n";
    echo "\nJalankan server dengan:\n";
    echo "  php -S localhost:8000\n";
    echo "\nAtau gunakan:\n";
    echo "  start_server.bat (Windows)\n";
    echo "========================================\n";
    
} catch (Exception $e) {
    echo "❌ Error: " . $e->getMessage() . "\n";
    exit(1);
}

<?php
/**
 * Script untuk setup MySQL database
 * Jalankan sekali saat pertama kali setup
 */

$dbHost = getenv('DB_HOST') ?: 'localhost';
$dbName = getenv('DB_NAME') ?: 'e_katalog';
$dbUser = getenv('DB_USER') ?: 'root';
$dbPass = getenv('DB_PASS') ?: '';
$dbCharset = getenv('DB_CHARSET') ?: 'utf8mb4';

echo "========================================\n";
echo "Setup Database MySQL E-Katalog\n";
echo "========================================\n";
echo "Host: $dbHost\n";
echo "Database: $dbName\n";
echo "User: $dbUser\n";
echo "\n";

try {
    // Koneksi ke MySQL server (tanpa database)
    $dsn = "mysql:host=$dbHost;charset=$dbCharset";
    $db = new PDO($dsn, $dbUser, $dbPass, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    ]);

    echo "✓ Terkoneksi ke MySQL server\n";

    // Buat database jika belum ada
    $db->exec("CREATE DATABASE IF NOT EXISTS `$dbName` CHARACTER SET $dbCharset COLLATE utf8mb4_unicode_ci");
    echo "✓ Database '$dbName' siap\n";

    // Pilih database
    $db->exec("USE `$dbName`");
    echo "✓ Database dipilih\n";

    // Buat tabel kategori
    $db->exec("CREATE TABLE IF NOT EXISTS tb_kategori (
        id_kategori INT PRIMARY KEY AUTO_INCREMENT,
        jenis_kategori VARCHAR(100) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=$dbCharset");
    echo "✓ Tabel tb_kategori berhasil dibuat\n";

    // Buat tabel produk
    $db->exec("CREATE TABLE IF NOT EXISTS tb_produk (
        id_produk INT PRIMARY KEY AUTO_INCREMENT,
        nama_produk VARCHAR(255) NOT NULL,
        harga DECIMAL(12, 2) NOT NULL,
        stok INT NOT NULL DEFAULT 0,
        deskripsi TEXT,
        gambar VARCHAR(255) DEFAULT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=$dbCharset");
    echo "✓ Tabel tb_produk berhasil dibuat\n";

    // Buat tabel produk_kategori (junction table)
    $db->exec("CREATE TABLE IF NOT EXISTS tb_produk_kategori (
        id_produk_kategori INT PRIMARY KEY AUTO_INCREMENT,
        id_produk INT NOT NULL,
        id_kategori INT NOT NULL,
        FOREIGN KEY (id_produk) REFERENCES tb_produk(id_produk) ON DELETE CASCADE,
        FOREIGN KEY (id_kategori) REFERENCES tb_kategori(id_kategori) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=$dbCharset");
    echo "✓ Tabel tb_produk_kategori berhasil dibuat\n";

    // Cek apakah sudah ada data kategori
    $stmt = $db->query("SELECT COUNT(*) as count FROM tb_kategori");
    $count = $stmt->fetch()['count'];

    if ($count == 0) {
        // Insert sample data kategori
        $db->exec("INSERT INTO tb_kategori (jenis_kategori) VALUES 
            ('Elektronik'), ('Makanan'), ('Pakaian')
        ");
        echo "✓ Data kategori sample berhasil ditambahkan\n";

        // Insert sample data produk
        $db->exec("INSERT INTO tb_produk (nama_produk, harga, stok, deskripsi) VALUES 
            ('Laptop HP', 5000000, 10, 'Laptop gaming HP terbaru'),
            ('Keyboard Mekanik', 500000, 25, 'Keyboard RGB mekanik'),
            ('Monitor 27 inch', 2000000, 15, 'Monitor IPS 144Hz')
        ");
        echo "✓ Data produk sample berhasil ditambahkan\n";

        // Insert relasi produk-kategori
        $db->exec("INSERT INTO tb_produk_kategori (id_produk, id_kategori) VALUES 
            (1, 1), (2, 1), (3, 1)
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
    echo "Database: $dbName\n";
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
?>

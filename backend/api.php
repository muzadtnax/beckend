<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// SQLite database path
$dbPath = __DIR__ . '/../data/e_katalog.db';

// Pastikan directory data ada
@mkdir(__DIR__ . '/../data', 0777, true);

// Fungsi untuk membuat koneksi SQLite
function createConnection() {
    global $dbPath;
    try {
        $db = new PDO('sqlite:' . $dbPath);
        $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        
        // Initialize database jika belum ada tabel
        initializeDatabase($db);
        return $db;
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Connection failed: ' . $e->getMessage()]);
        exit();
    }
}

// Inisialisasi database table
function initializeDatabase($db) {
    $tables = [
        "CREATE TABLE IF NOT EXISTS tb_kategori (
            id_kategori INTEGER PRIMARY KEY AUTOINCREMENT,
            jenis_kategori TEXT NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )",
        "CREATE TABLE IF NOT EXISTS tb_produk (
            id_produk INTEGER PRIMARY KEY AUTOINCREMENT,
            nama_produk TEXT NOT NULL,
            harga REAL NOT NULL,
            stok INTEGER NOT NULL DEFAULT 0,
            deskripsi TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )",
        "CREATE TABLE IF NOT EXISTS tb_produk_kategori (
            id_produk_kategori INTEGER PRIMARY KEY AUTOINCREMENT,
            id_produk INTEGER NOT NULL,
            id_kategori INTEGER NOT NULL,
            FOREIGN KEY(id_produk) REFERENCES tb_produk(id_produk) ON DELETE CASCADE,
            FOREIGN KEY(id_kategori) REFERENCES tb_kategori(id_kategori) ON DELETE CASCADE
        )"
    ];
    
    foreach ($tables as $sql) {
        try {
            $db->exec($sql);
        } catch (Exception $e) {
            // Table sudah ada, skip
        }
    }
    
    // Insert sample data jika tabel kategori kosong
    try {
        $result = $db->query("SELECT COUNT(*) as cnt FROM tb_kategori");
        $row = $result->fetch(PDO::FETCH_ASSOC);
        
        if ($row['cnt'] == 0) {
            $db->exec("INSERT INTO tb_kategori (jenis_kategori) VALUES ('Elektronik'), ('Makanan'), ('Pakaian')");
            $db->exec("INSERT INTO tb_produk (nama_produk, harga, stok, deskripsi) VALUES 
                ('Laptop HP', 5000000, 10, 'Laptop gaming HP terbaru'),
                ('Keyboard Mekanik', 500000, 25, 'Keyboard RGB mekanik'),
                ('Monitor 27 inch', 2000000, 15, 'Monitor IPS 144Hz')");
        }
    } catch (Exception $e) {
        // Ignore
    }
}

// Fetch semua kategori
function fetchKategori($db) {
    try {
        $stmt = $db->query("SELECT * FROM tb_kategori ORDER BY id_kategori");
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    } catch (Exception $e) {
        return ['error' => $e->getMessage()];
    }
}

// Fetch semua produk
function fetchProduk($db) {
    try {
        $stmt = $db->query("SELECT * FROM tb_produk ORDER BY id_produk");
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    } catch (Exception $e) {
        return ['error' => $e->getMessage()];
    }
}

// Fetch produk dengan kategori (join)
function fetchProdukDenganKategori($db) {
    try {
        $sql = "SELECT p.id_produk, p.nama_produk, p.harga, p.stok, k.jenis_kategori
                FROM tb_produk p
                LEFT JOIN tb_produk_kategori pk ON p.id_produk = pk.id_produk
                LEFT JOIN tb_kategori k ON pk.id_kategori = k.id_kategori
                ORDER BY p.id_produk";
        $stmt = $db->query($sql);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    } catch (Exception $e) {
        return ['error' => $e->getMessage()];
    }
}

// Fetch relasi produk-kategori
function fetchProdukKategori($db) {
    try {
        $sql = "SELECT pk.id_produk_kategori, p.nama_produk, p.harga, p.stok, k.jenis_kategori
                FROM tb_produk_kategori pk
                JOIN tb_produk p ON pk.id_produk = p.id_produk
                JOIN tb_kategori k ON pk.id_kategori = k.id_kategori
                ORDER BY pk.id_produk_kategori";
        $stmt = $db->query($sql);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    } catch (Exception $e) {
        return ['error' => $e->getMessage()];
    }
}

// Tambah produk
function addProduk($db, $data) {
    // Validasi input
    if (!isset($data['nama_produk']) || !isset($data['harga']) || !isset($data['stok'])) {
        http_response_code(400);
        return ['error' => 'Missing required fields: nama_produk, harga, stok'];
    }
    
    try {
        $sql = "INSERT INTO tb_produk (nama_produk, harga, stok, deskripsi) VALUES (?, ?, ?, ?)";
        $stmt = $db->prepare($sql);
        $deskripsi = $data['deskripsi'] ?? '';
        $stmt->execute([$data['nama_produk'], $data['harga'], $data['stok'], $deskripsi]);
        
        return ['success' => true, 'message' => 'Produk berhasil ditambahkan', 'id' => $db->lastInsertId()];
    } catch (Exception $e) {
        http_response_code(500);
        return ['error' => 'Error: ' . $e->getMessage()];
    }
}

// Update produk
function updateProduk($db, $id, $data) {
    try {
        $sql = "UPDATE tb_produk SET nama_produk = ?, harga = ?, stok = ?, deskripsi = ? WHERE id_produk = ?";
        $stmt = $db->prepare($sql);
        $deskripsi = $data['deskripsi'] ?? '';
        $stmt->execute([$data['nama_produk'], $data['harga'], $data['stok'], $deskripsi, $id]);
        
        return ['success' => true, 'message' => 'Produk berhasil diupdate'];
    } catch (Exception $e) {
        http_response_code(500);
        return ['error' => 'Error: ' . $e->getMessage()];
    }
}

// Delete produk
function deleteProduk($db, $id) {
    try {
        $sql = "DELETE FROM tb_produk WHERE id_produk = ?";
        $stmt = $db->prepare($sql);
        $stmt->execute([$id]);
        
        return ['success' => true, 'message' => 'Produk berhasil dihapus'];
    } catch (Exception $e) {
        http_response_code(500);
        return ['error' => 'Error: ' . $e->getMessage()];
    }
}

// Handle request
$db = createConnection();
$method = $_SERVER['REQUEST_METHOD'];
$action = $_GET['action'] ?? '';

if ($method === 'GET') {
    switch ($action) {
        case 'fetchKategori':
            echo json_encode(fetchKategori($db));
            break;
        case 'fetchProduk':
            echo json_encode(fetchProduk($db));
            break;
        case 'fetchProdukDenganKategori':
            echo json_encode(fetchProdukDenganKategori($db));
            break;
        case 'fetchProdukKategori':
            echo json_encode(fetchProdukKategori($db));
            break;
        default:
            http_response_code(400);
            echo json_encode(['error' => 'Invalid action']);
            break;
    }
} else if ($method === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);
    
    if ($action === 'addProduk') {
        echo json_encode(addProduk($db, $input));
    } else {
        http_response_code(400);
        echo json_encode(['error' => 'Invalid action for POST']);
    }
} else if ($method === 'PUT') {
    $input = json_decode(file_get_contents('php://input'), true);
    $id = $_GET['id'] ?? null;
    
    if ($action === 'updateProduk' && $id) {
        echo json_encode(updateProduk($db, $id, $input));
    } else {
        http_response_code(400);
        echo json_encode(['error' => 'Invalid action for PUT or missing ID']);
    }
} else if ($method === 'DELETE') {
    $id = $_GET['id'] ?? null;
    
    if ($action === 'deleteProduk' && $id) {
        echo json_encode(deleteProduk($db, $id));
    } else {
        http_response_code(400);
        echo json_encode(['error' => 'Invalid action for DELETE or missing ID']);
    }
} else {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
}
?>
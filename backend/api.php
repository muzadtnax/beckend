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


// Fungsi untuk membuat koneksi MySQL
function createConnection() {
    $host = 'localhost';
    $dbname = 'e_katalog';
    $user = 'root'; // Ganti jika password MySQL kamu berbeda
    $pass = '';
    try {
        $db = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8", $user, $pass);
        $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        return $db;
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Connection failed: ' . $e->getMessage()]);
        exit();
    }
}

// Hapus fungsi initializeDatabase (tidak perlu untuk MySQL, tabel sudah ada)

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
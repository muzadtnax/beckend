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

// Konfigurasi koneksi MySQL
$dbConfig = [
    'host' => '127.0.0.1',
    'user' => 'root',
    'password' => '',
    'database' => 'e_katalog'
];

// Fungsi untuk membuat koneksi
function createConnection() {
    global $dbConfig;
    $conn = new mysqli($dbConfig['host'], $dbConfig['user'], $dbConfig['password'], $dbConfig['database']);
    if ($conn->connect_error) {
        http_response_code(500);
        echo json_encode(['error' => 'Connection failed: ' . $conn->connect_error]);
        exit();
    }
    return $conn;
}

// Fungsi untuk fetch semua kategori
function fetchKategori() {
    $conn = createConnection();
    $sql = "SELECT * FROM tb_kategori";
    $result = $conn->query($sql);
    $data = [];
    if ($result) {
        while ($row = $result->fetch_assoc()) {
            $data[] = $row;
        }
    }
    $conn->close();
    return $data;
}

// Fungsi untuk fetch semua produk
function fetchProduk() {
    $conn = createConnection();
    $sql = "SELECT * FROM tb_produk";
    $result = $conn->query($sql);
    $data = [];
    if ($result) {
        while ($row = $result->fetch_assoc()) {
            $data[] = $row;
        }
    }
    $conn->close();
    return $data;
}

// Fungsi untuk fetch produk dengan kategori (join)
function fetchProdukDenganKategori() {
    $conn = createConnection();
    $sql = "
        SELECT p.id_produk, p.nama_produk, p.harga, p.stok, k.jenis_kategori
        FROM tb_produk p
        JOIN tb_produk_kategori pk ON p.id_produk = pk.id_produk
        JOIN tb_kategori k ON pk.id_kategori = k.id_kategori
    ";
    $result = $conn->query($sql);
    $data = [];
    if ($result) {
        while ($row = $result->fetch_assoc()) {
            $data[] = $row;
        }
    }
    $conn->close();
    return $data;
}

// Fungsi untuk fetch relasi produk-kategori
function fetchProdukKategori() {
    $conn = createConnection();
    $sql = "
        SELECT pk.id_produk_kategori, p.nama_produk, p.harga, p.stok, k.jenis_kategori
        FROM tb_produk_kategori pk
        JOIN tb_produk p ON pk.id_produk = p.id_produk
        JOIN tb_kategori k ON pk.id_kategori = k.id_kategori
    ";
    $result = $conn->query($sql);
    $data = [];
    if ($result) {
        while ($row = $result->fetch_assoc()) {
            $data[] = $row;
        }
    }
    $conn->close();
    return $data;
}

// Fungsi untuk menambah produk
function addProduk($data) {
    $conn = createConnection();
    
    // Validasi input
    if (!isset($data['nama_produk']) || !isset($data['harga']) || !isset($data['stok'])) {
        http_response_code(400);
        return ['error' => 'Missing required fields: nama_produk, harga, stok'];
    }
    
    $nama_produk = $conn->real_escape_string($data['nama_produk']);
    $harga = floatval($data['harga']);
    $stok = intval($data['stok']);
    $deskripsi = isset($data['deskripsi']) ? $conn->real_escape_string($data['deskripsi']) : '';
    
    $sql = "INSERT INTO tb_produk (nama_produk, harga, stok, deskripsi) VALUES ('$nama_produk', $harga, $stok, '$deskripsi')";
    
    if ($conn->query($sql) === TRUE) {
        $conn->close();
        return ['success' => true, 'message' => 'Produk berhasil ditambahkan', 'id' => $conn->insert_id];
    } else {
        $error = $conn->error;
        $conn->close();
        http_response_code(500);
        return ['error' => 'Error: ' . $error];
    }
}

// Handle request berdasarkan method
$method = $_SERVER['REQUEST_METHOD'];
$action = $_GET['action'] ?? '';

if ($method === 'GET') {
    switch ($action) {
        case 'fetchKategori':
            echo json_encode(fetchKategori());
            break;
        case 'fetchProduk':
            echo json_encode(fetchProduk());
            break;
        case 'fetchProdukDenganKategori':
            echo json_encode(fetchProdukDenganKategori());
            break;
        case 'fetchProdukKategori':
            echo json_encode(fetchProdukKategori());
            break;
        default:
            http_response_code(400);
            echo json_encode(['error' => 'Invalid action']);
            break;
    }
} else if ($method === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);
    
    if ($action === 'addProduk') {
        echo json_encode(addProduk($input));
    } else {
        http_response_code(400);
        echo json_encode(['error' => 'Invalid action for POST']);
    }
} else {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
}
?>
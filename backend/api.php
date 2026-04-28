<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

function createConnection() {
    $dbPath = __DIR__ . '/../data/e_katalog.db';
    
    try {
        $db = new PDO("sqlite:$dbPath");
        $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        return $db;
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Connection failed: ' . $e->getMessage()]);
        exit();
    }
}

function handleFileUpload($fieldName) {
    if (!isset($_FILES[$fieldName]) || $_FILES[$fieldName]['error'] !== UPLOAD_ERR_OK) {
        return null;
    }

    $allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    $fileType = mime_content_type($_FILES[$fieldName]['tmp_name']);
    if (!in_array($fileType, $allowedTypes)) {
        return null;
    }

    $uploadDir = __DIR__ . '/uploads';
    if (!is_dir($uploadDir)) {
        mkdir($uploadDir, 0755, true);
    }

    $extension = pathinfo($_FILES[$fieldName]['name'], PATHINFO_EXTENSION);
    $filename = uniqid('img_', true) . '.' . $extension;
    $destination = $uploadDir . '/' . $filename;

    if (move_uploaded_file($_FILES[$fieldName]['tmp_name'], $destination)) {
        return $filename;
    }

    return null;
}

function fetchKategori($db) {
    try {
        $stmt = $db->query("SELECT * FROM tb_kategori ORDER BY id_kategori ASC");
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    } catch (Exception $e) {
        return ['error' => $e->getMessage()];
    }
}

function fetchProduk($db) {
    try {
        $stmt = $db->query("SELECT p.id_produk, p.nama_produk, p.harga, p.stok, p.deskripsi, p.gambar, k.id_kategori AS kategori_id, k.jenis_kategori FROM tb_produk p LEFT JOIN tb_produk_kategori pk ON p.id_produk = pk.id_produk LEFT JOIN tb_kategori k ON pk.id_kategori = k.id_kategori ORDER BY p.id_produk ASC");
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    } catch (Exception $e) {
        return ['error' => $e->getMessage()];
    }
}

function fetchProdukById($db, $id) {
    try {
        $sql = "SELECT p.id_produk, p.nama_produk, p.harga, p.stok, p.deskripsi, p.gambar, k.id_kategori AS kategori_id, k.jenis_kategori FROM tb_produk p LEFT JOIN tb_produk_kategori pk ON p.id_produk = pk.id_produk LEFT JOIN tb_kategori k ON pk.id_kategori = k.id_kategori WHERE p.id_produk = ?";
        $stmt = $db->prepare($sql);
        $stmt->execute([$id]);
        $result = $stmt->fetch(PDO::FETCH_ASSOC);
        if (!$result) {
            return ['error' => 'Produk tidak ditemukan'];
        }
        return $result;
    } catch (Exception $e) {
        return ['error' => $e->getMessage()];
    }
}

function addProduk($db, $data) {
    if (!isset($data['nama_produk']) || !isset($data['harga']) || !isset($data['stok']) || !isset($data['kategori_id'])) {
        http_response_code(400);
        return ['error' => 'Missing required fields: nama_produk, harga, stok, kategori_id'];
    }

    try {
        $db->beginTransaction();

        $gambar = handleFileUpload('gambar');
        $stmt = $db->prepare("INSERT INTO tb_produk (nama_produk, harga, stok, deskripsi, gambar) VALUES (?, ?, ?, ?, ?)");
        $deskripsi = $data['deskripsi'] ?? '';
        $stmt->execute([$data['nama_produk'], $data['harga'], $data['stok'], $deskripsi, $gambar]);

        $produkId = $db->lastInsertId();
        $kategoriId = $data['kategori_id'];

        if (!empty($kategoriId)) {
            $stmtCheck = $db->prepare("SELECT COUNT(*) FROM tb_kategori WHERE id_kategori = ?");
            $stmtCheck->execute([$kategoriId]);
            if ($stmtCheck->fetchColumn() == 0) {
                throw new Exception('Kategori tidak ditemukan');
            }

            $stmtRelation = $db->prepare("INSERT INTO tb_produk_kategori (id_produk, id_kategori) VALUES (?, ?)");
            $stmtRelation->execute([$produkId, $kategoriId]);
        }

        $db->commit();
        return ['success' => true, 'message' => 'Produk berhasil ditambahkan', 'id' => $produkId];
    } catch (Exception $e) {
        $db->rollBack();
        http_response_code(500);
        return ['error' => 'Error: ' . $e->getMessage()];
    }
}

function updateProduk($db, $id, $data) {
    if (!isset($data['nama_produk']) || !isset($data['harga']) || !isset($data['stok']) || !isset($data['kategori_id'])) {
        http_response_code(400);
        return ['error' => 'Missing required fields: nama_produk, harga, stok, kategori_id'];
    }

    try {
        $db->beginTransaction();

        $currentStmt = $db->prepare("SELECT gambar FROM tb_produk WHERE id_produk = ?");
        $currentStmt->execute([$id]);
        $currentRow = $currentStmt->fetch(PDO::FETCH_ASSOC);
        $currentImage = $currentRow['gambar'] ?? null;

        $uploadedImage = handleFileUpload('gambar');
        $gambar = $uploadedImage ?: $currentImage;

        $stmt = $db->prepare("UPDATE tb_produk SET nama_produk = ?, harga = ?, stok = ?, deskripsi = ?, gambar = ? WHERE id_produk = ?");
        $deskripsi = $data['deskripsi'] ?? '';
        $stmt->execute([$data['nama_produk'], $data['harga'], $data['stok'], $deskripsi, $gambar, $id]);

        if ($uploadedImage && $currentImage) {
            $oldFile = __DIR__ . '/uploads/' . $currentImage;
            if (file_exists($oldFile)) {
                @unlink($oldFile);
            }
        }

        $kategoriId = $data['kategori_id'];
        $stmtDelete = $db->prepare("DELETE FROM tb_produk_kategori WHERE id_produk = ?");
        $stmtDelete->execute([$id]);

        if (!empty($kategoriId)) {
            $stmtCheck = $db->prepare("SELECT COUNT(*) FROM tb_kategori WHERE id_kategori = ?");
            $stmtCheck->execute([$kategoriId]);
            if ($stmtCheck->fetchColumn() == 0) {
                throw new Exception('Kategori tidak ditemukan');
            }
            $stmtRelation = $db->prepare("INSERT INTO tb_produk_kategori (id_produk, id_kategori) VALUES (?, ?)");
            $stmtRelation->execute([$id, $kategoriId]);
        }

        $db->commit();
        return ['success' => true, 'message' => 'Produk berhasil diupdate'];
    } catch (Exception $e) {
        $db->rollBack();
        http_response_code(500);
        return ['error' => 'Error: ' . $e->getMessage()];
    }
}

function deleteProduk($db, $id) {
    try {
        $currentStmt = $db->prepare("SELECT gambar FROM tb_produk WHERE id_produk = ?");
        $currentStmt->execute([$id]);
        $currentRow = $currentStmt->fetch(PDO::FETCH_ASSOC);
        $currentImage = $currentRow['gambar'] ?? null;

        $stmtRelation = $db->prepare("DELETE FROM tb_produk_kategori WHERE id_produk = ?");
        $stmtRelation->execute([$id]);

        $stmt = $db->prepare("DELETE FROM tb_produk WHERE id_produk = ?");
        $stmt->execute([$id]);

        if ($currentImage) {
            $oldFile = __DIR__ . '/uploads/' . $currentImage;
            if (file_exists($oldFile)) {
                @unlink($oldFile);
            }
        }

        return ['success' => true, 'message' => 'Produk berhasil dihapus'];
    } catch (Exception $e) {
        http_response_code(500);
        return ['error' => 'Error: ' . $e->getMessage()];
    }
}

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
        case 'fetchProdukById':
            $id = $_GET['id'] ?? null;
            if (!$id) {
                http_response_code(400);
                echo json_encode(['error' => 'Missing product ID']);
                break;
            }
            echo json_encode(fetchProdukById($db, $id));
            break;
        default:
            http_response_code(400);
            echo json_encode(['error' => 'Invalid action']);
            break;
    }
} else if ($method === 'POST') {
    $contentType = $_SERVER['CONTENT_TYPE'] ?? '';
    if (strpos($contentType, 'multipart/form-data') !== false) {
        $input = $_POST;
    } else {
        $input = json_decode(file_get_contents('php://input'), true);
    }

    if ($action === 'addProduk') {
        echo json_encode(addProduk($db, $input));
    } else if ($action === 'updateProduk') {
        $id = $_GET['id'] ?? null;
        if ($id) {
            echo json_encode(updateProduk($db, $id, $input));
        } else {
            http_response_code(400);
            echo json_encode(['error' => 'Missing product ID for update']);
        }
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

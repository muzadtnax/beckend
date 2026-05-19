<?php
$dbPath = __DIR__ . '/../data/e_katalog.db';

try {
    $db = new PDO("sqlite:$dbPath");
    $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    echo "=== Schema tb_produk ===\n";
    $stmt = $db->query("PRAGMA table_info(tb_produk)");
    $columns = $stmt->fetchAll(PDO::FETCH_ASSOC);
    foreach ($columns as $col) {
        echo "- {$col['name']} ({$col['type']})\n";
    }

    echo "\n=== Sample Data Produk ===\n";
    $stmt = $db->query("SELECT * FROM tb_produk LIMIT 2");
    $data = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE) . "\n";

    echo "\n=== Schema tb_kategori ===\n";
    $stmt = $db->query("PRAGMA table_info(tb_kategori)");
    $columns = $stmt->fetchAll(PDO::FETCH_ASSOC);
    foreach ($columns as $col) {
        echo "- {$col['name']} ({$col['type']})\n";
    }

    echo "\n=== Sample Data Kategori ===\n";
    $stmt = $db->query("SELECT * FROM tb_kategori");
    $data = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE) . "\n";

} catch (Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
}
?>

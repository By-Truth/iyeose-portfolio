<?php
require __DIR__ . '/../lib/db.php';
require __DIR__ . '/../lib/response.php';
require __DIR__ . '/../lib/auth.php';

cors();
$pdo = db();
$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    $stmt = $pdo->prepare('SELECT data FROM site_content WHERE id = ?');
    $stmt->execute(['main']);
    $row = $stmt->fetch();
    json_response(['data' => $row ? json_decode($row['data'], true) : null]);
}

if ($method === 'POST' || $method === 'PUT') {
    require_auth();
    $body = read_json_body();
    if (!array_key_exists('data', $body)) json_error('Missing "data"', 422);

    $json = json_encode($body['data']);
    $driver = $pdo->getAttribute(PDO::ATTR_DRIVER_NAME);

    if ($driver === 'sqlite') {
        $stmt = $pdo->prepare(
            "INSERT INTO site_content (id, data, updated_at) VALUES ('main', ?, datetime('now'))
             ON CONFLICT(id) DO UPDATE SET data = excluded.data, updated_at = excluded.updated_at"
        );
    } else {
        $stmt = $pdo->prepare(
            "INSERT INTO site_content (id, data) VALUES ('main', ?)
             ON DUPLICATE KEY UPDATE data = VALUES(data)"
        );
    }
    $stmt->execute([$json]);
    json_response(['ok' => true]);
}

json_error('Method not allowed', 405);

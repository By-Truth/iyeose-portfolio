<?php
require __DIR__ . '/../lib/db.php';
require __DIR__ . '/../lib/response.php';
require __DIR__ . '/../lib/auth.php';

cors();
$pdo = db();
$method = $_SERVER['REQUEST_METHOD'];

// Public: the Contact form submits here with no auth required.
if ($method === 'POST') {
    $body = read_json_body();
    $name = trim($body['name'] ?? '');
    $email = trim($body['email'] ?? '');
    $message = trim($body['message'] ?? '');

    if (!$name || !$email || !$message) json_error('Missing fields', 422);
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) json_error('Invalid email', 422);

    $stmt = $pdo->prepare('INSERT INTO messages (name, email, message) VALUES (?, ?, ?)');
    $stmt->execute([$name, $email, $message]);
    json_response(['ok' => true], 201);
}

// Everything else is admin-only.
require_auth();

if ($method === 'GET') {
    $rows = $pdo->query('SELECT * FROM messages ORDER BY created_at DESC')->fetchAll();
    foreach ($rows as &$row) {
        $row['is_read'] = (bool) $row['is_read'];
    }
    json_response(['messages' => $rows]);
}

if ($method === 'PATCH') {
    $id = $_GET['id'] ?? null;
    if (!$id) json_error('Missing id');
    $body = read_json_body();
    $stmt = $pdo->prepare('UPDATE messages SET is_read = ? WHERE id = ?');
    $stmt->execute([!empty($body['read']) ? 1 : 0, $id]);
    json_response(['ok' => true]);
}

if ($method === 'DELETE') {
    $id = $_GET['id'] ?? null;
    if (!$id) json_error('Missing id');
    $stmt = $pdo->prepare('DELETE FROM messages WHERE id = ?');
    $stmt->execute([$id]);
    json_response(['ok' => true]);
}

json_error('Method not allowed', 405);

<?php
require __DIR__ . '/../../lib/db.php';
require __DIR__ . '/../../lib/response.php';
require __DIR__ . '/../../lib/auth.php';

cors();
if ($_SERVER['REQUEST_METHOD'] !== 'POST') json_error('Method not allowed', 405);

$body = read_json_body();
$email = trim($body['email'] ?? '');
$password = $body['password'] ?? '';
if (!$email || !$password) json_error('Missing credentials', 422);

$pdo = db();
$stmt = $pdo->prepare('SELECT * FROM admin_users WHERE email = ?');
$stmt->execute([$email]);
$user = $stmt->fetch();

if (!$user || !password_verify($password, $user['password_hash'])) {
    json_error('Invalid email or password', 401);
}

$token = create_token(['sub' => $user['email']], config()['jwt_secret']);
json_response(['token' => $token, 'email' => $user['email']]);

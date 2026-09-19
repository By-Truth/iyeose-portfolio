<?php
require __DIR__ . '/../lib/db.php';
require __DIR__ . '/../lib/response.php';

cors();
if ($_SERVER['REQUEST_METHOD'] !== 'POST') json_error('Method not allowed', 405);

$body = read_json_body();
$path = substr(trim($body['path'] ?? '/'), 0, 500);
$referrer = substr(trim($body['referrer'] ?? ''), 0, 500) ?: null;
$userAgent = substr($_SERVER['HTTP_USER_AGENT'] ?? '', 0, 500) ?: null;
$ip = $_SERVER['HTTP_X_FORWARDED_FOR'] ?? $_SERVER['REMOTE_ADDR'] ?? null;

$pdo = db();
$stmt = $pdo->prepare('INSERT INTO visits (path, referrer, user_agent, ip) VALUES (?, ?, ?, ?)');
$stmt->execute([$path, $referrer, $userAgent, $ip]);

json_response(['ok' => true], 201);

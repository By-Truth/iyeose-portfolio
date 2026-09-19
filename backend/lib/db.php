<?php

function config(): array
{
    static $config;
    if ($config !== null) return $config;
    $path = __DIR__ . '/../config.php';
    if (!file_exists($path)) {
        http_response_code(500);
        header('Content-Type: application/json');
        echo json_encode(['error' => 'Backend not configured: copy backend/config.example.php to backend/config.php']);
        exit;
    }
    $config = require $path;
    return $config;
}

function db(): PDO
{
    static $pdo;
    if ($pdo) return $pdo;
    $c = config();
    $pdo = new PDO($c['db_dsn'], $c['db_user'] ?? null, $c['db_pass'] ?? null, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    ]);
    if ($pdo->getAttribute(PDO::ATTR_DRIVER_NAME) === 'sqlite') {
        $pdo->exec('PRAGMA foreign_keys = ON');
    }
    return $pdo;
}

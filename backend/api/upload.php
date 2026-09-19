<?php
require __DIR__ . '/../lib/db.php';
require __DIR__ . '/../lib/response.php';
require __DIR__ . '/../lib/auth.php';

cors();
if ($_SERVER['REQUEST_METHOD'] !== 'POST') json_error('Method not allowed', 405);
require_auth();

if (empty($_FILES['image']) || $_FILES['image']['error'] !== UPLOAD_ERR_OK) {
    json_error('No image uploaded (or upload error)', 422);
}

$file = $_FILES['image'];
$maxBytes = 5 * 1024 * 1024; // 5MB
if ($file['size'] > $maxBytes) json_error('Image too large (max 5MB)', 422);

$finfo = finfo_open(FILEINFO_MIME_TYPE);
$mime = finfo_file($finfo, $file['tmp_name']);
finfo_close($finfo);

$allowed = ['image/jpeg' => 'jpg', 'image/png' => 'png', 'image/webp' => 'webp', 'image/gif' => 'gif'];
if (!isset($allowed[$mime])) json_error('Unsupported image type: ' . $mime, 422);

$dir = __DIR__ . '/../uploads';
if (!is_dir($dir)) mkdir($dir, 0755, true);

$name = bin2hex(random_bytes(16)) . '.' . $allowed[$mime];
$dest = "$dir/$name";

if (!move_uploaded_file($file['tmp_name'], $dest)) {
    json_error('Failed to save upload', 500);
}

$base = rtrim(config()['public_url'] ?? '', '/');
json_response(['url' => "$base/uploads/$name"], 201);

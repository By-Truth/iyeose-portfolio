<?php
// Creates (or resets the password of) the single admin login.
// Usage: php backend/bin/create-admin.php you@example.com "your-password"

require __DIR__ . '/../lib/db.php';

$email = $argv[1] ?? null;
$password = $argv[2] ?? null;

if (!$email || !$password) {
    fwrite(STDERR, "Usage: php backend/bin/create-admin.php <email> <password>\n");
    exit(1);
}

$pdo = db();
$hash = password_hash($password, PASSWORD_BCRYPT);
$driver = $pdo->getAttribute(PDO::ATTR_DRIVER_NAME);

if ($driver === 'sqlite') {
    $stmt = $pdo->prepare(
        'INSERT INTO admin_users (email, password_hash) VALUES (?, ?)
         ON CONFLICT(email) DO UPDATE SET password_hash = excluded.password_hash'
    );
} else {
    $stmt = $pdo->prepare(
        'INSERT INTO admin_users (email, password_hash) VALUES (?, ?)
         ON DUPLICATE KEY UPDATE password_hash = VALUES(password_hash)'
    );
}
$stmt->execute([$email, $hash]);

echo "Admin ready: $email\n";

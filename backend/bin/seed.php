<?php
// Populates site_content with the portfolio content shipped in
// backend/db/seed-content.json — but only if the row doesn't exist yet, so
// re-running this never clobbers content you've already edited from /admin.
// Usage: php backend/bin/seed.php [--force]

require __DIR__ . '/../lib/db.php';

$pdo = db();
$force = in_array('--force', $argv, true);

$stmt = $pdo->prepare('SELECT id FROM site_content WHERE id = ?');
$stmt->execute(['main']);
if ($stmt->fetch() && !$force) {
    echo "site_content already has data — skipping (pass --force to overwrite).\n";
    exit(0);
}

$json = file_get_contents(__DIR__ . '/../db/seed-content.json');
// Re-encode compactly to validate it's well-formed JSON before writing.
$data = json_decode($json, true);
if ($data === null) {
    fwrite(STDERR, "seed-content.json is not valid JSON.\n");
    exit(1);
}
$compact = json_encode($data);

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
$stmt->execute([$compact]);

echo "Seeded site_content.\n";

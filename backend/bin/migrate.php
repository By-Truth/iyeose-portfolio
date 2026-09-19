<?php
// Creates the tables for whichever database backend/config.php points at.
// Usage: php backend/bin/migrate.php

require __DIR__ . '/../lib/db.php';

$pdo = db();
$driver = $pdo->getAttribute(PDO::ATTR_DRIVER_NAME);
$file = $driver === 'sqlite' ? __DIR__ . '/../db/schema.sqlite.sql' : __DIR__ . '/../db/schema.mysql.sql';

$sql = file_get_contents($file);
foreach (array_filter(array_map('trim', explode(';', $sql))) as $statement) {
    $pdo->exec($statement);
}

echo "Migrated ($driver) using $file\n";

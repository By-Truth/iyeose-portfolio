<?php
require __DIR__ . '/../lib/db.php';
require __DIR__ . '/../lib/response.php';
require __DIR__ . '/../lib/auth.php';

cors();
if ($_SERVER['REQUEST_METHOD'] !== 'GET') json_error('Method not allowed', 405);
require_auth();

$pdo = db();
$sinceId = isset($_GET['since_id']) ? (int) $_GET['since_id'] : null;

if ($sinceId) {
    $stmt = $pdo->prepare('SELECT * FROM visits WHERE id > ? ORDER BY id DESC LIMIT 100');
    $stmt->execute([$sinceId]);
} else {
    $stmt = $pdo->query('SELECT * FROM visits ORDER BY id DESC LIMIT 50');
}

$rows = $stmt->fetchAll();

$today = (new DateTime('today'))->format('Y-m-d');
$total = (int) $pdo->query('SELECT COUNT(*) as c FROM visits')->fetch()['c'];
$todayStmt = $pdo->prepare("SELECT COUNT(*) as c FROM visits WHERE created_at >= ?");
$todayStmt->execute([$today . ' 00:00:00']);
$todayCount = (int) $todayStmt->fetch()['c'];

json_response([
    'visits' => $rows,
    'total' => $total,
    'today_count' => $todayCount,
]);

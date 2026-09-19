<?php
require __DIR__ . '/../../lib/db.php';
require __DIR__ . '/../../lib/response.php';
require __DIR__ . '/../../lib/auth.php';

cors();
$claims = require_auth(); // exits with 401 if the token is missing/invalid/expired
json_response(['email' => $claims['sub'] ?? null]);

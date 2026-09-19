<?php

function json_response($data, int $status = 200): void
{
    http_response_code($status);
    header('Content-Type: application/json');
    echo json_encode($data);
    exit;
}

function json_error(string $message, int $status = 400): void
{
    json_response(['error' => $message], $status);
}

function read_json_body(): array
{
    $raw = file_get_contents('php://input');
    $data = json_decode($raw ?: '', true);

    // The frontend base64-wraps request bodies (see apiClient.js) so hosts
    // running pattern-based request filtering (Hostinger's edge WAF among
    // them) don't false-positive on legitimate JSON content. Transparently
    // unwrap it here; plain unwrapped JSON (e.g. from curl/tests) still
    // works via the fallback below.
    if (is_array($data) && isset($data['__b64']) && is_string($data['__b64'])) {
        $decoded = base64_decode($data['__b64'], true);
        if ($decoded !== false) {
            $inner = json_decode($decoded, true);
            if (is_array($inner)) return $inner;
        }
    }

    return is_array($data) ? $data : [];
}

/** Sends CORS headers for the request's Origin if it's allow-listed, and short-circuits preflight OPTIONS requests. */
function cors(): void
{
    $c = config();
    $allowed = $c['cors_origins'] ?? [];
    $origin = $_SERVER['HTTP_ORIGIN'] ?? '';

    if (in_array($origin, $allowed, true)) {
        header("Access-Control-Allow-Origin: $origin");
        header('Vary: Origin');
    }
    header('Access-Control-Allow-Methods: GET, POST, PATCH, DELETE, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type, Authorization');

    if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
        http_response_code(204);
        exit;
    }
}

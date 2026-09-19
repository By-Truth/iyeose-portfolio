<?php
// A minimal, dependency-free HS256 JWT — no Composer install required, so
// this drops onto any PHP host as-is.

function b64url_encode(string $data): string
{
    return rtrim(strtr(base64_encode($data), '+/', '-_'), '=');
}

function b64url_decode(string $data): string
{
    return base64_decode(strtr($data, '-_', '+/')) ?: '';
}

function create_token(array $payload, string $secret, int $ttlSeconds = 60 * 60 * 24 * 7): string
{
    $header = b64url_encode(json_encode(['alg' => 'HS256', 'typ' => 'JWT']));
    $payload['exp'] = time() + $ttlSeconds;
    $payloadEncoded = b64url_encode(json_encode($payload));
    $signature = b64url_encode(hash_hmac('sha256', "$header.$payloadEncoded", $secret, true));
    return "$header.$payloadEncoded.$signature";
}

function verify_token(string $token, string $secret): ?array
{
    $parts = explode('.', $token);
    if (count($parts) !== 3) return null;
    [$header, $payload, $signature] = $parts;

    $expected = b64url_encode(hash_hmac('sha256', "$header.$payload", $secret, true));
    if (!hash_equals($expected, $signature)) return null;

    $data = json_decode(b64url_decode($payload), true);
    if (!is_array($data) || !isset($data['exp']) || $data['exp'] < time()) return null;

    return $data;
}

/** Reads the Authorization header across Apache/FPM/CLI-server setups, where getallheaders() isn't always reliable. */
function bearer_token(): ?string
{
    $header = null;
    if (function_exists('getallheaders')) {
        foreach (getallheaders() as $name => $value) {
            if (strtolower($name) === 'authorization') $header = $value;
        }
    }
    $header ??= $_SERVER['HTTP_AUTHORIZATION'] ?? $_SERVER['REDIRECT_HTTP_AUTHORIZATION'] ?? null;
    if ($header && preg_match('/^Bearer\s+(.+)$/i', $header, $m)) {
        return $m[1];
    }
    return null;
}

/** Ends the request with 401 unless a valid bearer token is present; otherwise returns its claims. */
function require_auth(): array
{
    $token = bearer_token();
    if (!$token) json_error('Unauthorized', 401);

    $claims = verify_token($token, config()['jwt_secret']);
    if (!$claims) json_error('Unauthorized', 401);

    return $claims;
}

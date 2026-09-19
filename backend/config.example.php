<?php
// Copy this file to config.php (same folder) and adjust it — config.php is
// gitignored so your real secrets never get committed.

return [
    // Default: a local SQLite file, zero setup — good for dev and even small
    // production sites. For shared hosting with MySQL/MariaDB (cPanel etc.),
    // swap the DSN below:
    //   'db_dsn' => 'mysql:host=localhost;dbname=your_db;charset=utf8mb4',
    //   'db_user' => 'your_db_user',
    //   'db_pass' => 'your_db_password',
    'db_dsn' => 'sqlite:' . __DIR__ . '/data/database.sqlite',
    'db_user' => null,
    'db_pass' => null,

    // Signs admin login tokens. Generate a long random string, e.g.:
    //   php -r "echo bin2hex(random_bytes(32)), PHP_EOL;"
    'jwt_secret' => 'CHANGE_ME_TO_A_LONG_RANDOM_STRING',

    // Origins allowed to call this API from a browser (your frontend's URL).
    // Add every origin the site is actually served from (www vs non-www,
    // localhost during dev, etc).
    'cors_origins' => [
        'http://localhost:5173',
        'https://your-portfolio-domain.com',
    ],

    // The URL this backend itself is reachable at — used to build absolute
    // links to uploaded images (they're served from here, not from the
    // frontend's host). Update this to your real backend URL once deployed.
    'public_url' => 'http://localhost:8000',
];

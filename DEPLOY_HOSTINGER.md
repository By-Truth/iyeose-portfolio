# Deploying to Hostinger — step by step

This assumes you already have a Hostinger hosting plan and a domain pointed
at it. Follow these in order — later steps depend on earlier ones.

---

## Part 1 — Gather your info

Before touching any files, log into **hPanel** (hpanel.hostinger.com) and
collect three things:

### 1a. Your domain
Write down the exact domain, e.g. `iyeose.com`. Everything below uses
`yourdomain.com` — swap in your real one every time you see it.

### 1b. A MySQL database
In hPanel: **Databases → MySQL Databases** → **Create New Database**.

- Give it a name (Hostinger usually prefixes it automatically, e.g.
  `u123456789_portfolio`)
- Create a database user with a strong password
- Attach that user to the database with **all privileges**
- **Write down all four values**: database name, username, password, host
  (almost always `localhost` on Hostinger)

### 1c. Check for SSH access
In hPanel: **Advanced → SSH Access**. If it shows connection details
(host/port/username), you have it — this makes step 4 much easier. If it's
locked/unavailable on your plan, don't worry, there's a no-SSH path for
everything below.

---

## Part 2 — Configure the project on your computer

Open the project in your editor (you're already here).

### 2a. Edit `backend/config.php`

Open `backend/config.php` and change these three sections:

```php
// Was the SQLite line — comment it out or delete it, use this instead:
'db_dsn' => 'mysql:host=localhost;dbname=YOUR_DB_NAME;charset=utf8mb4',
'db_user' => 'YOUR_DB_USER',
'db_pass' => 'YOUR_DB_PASSWORD',
```

```php
'cors_origins' => [
    'https://yourdomain.com',
    'https://www.yourdomain.com',
],
```

```php
'public_url' => 'https://yourdomain.com/backend',
```

Leave `jwt_secret` as the random value already there (or generate a new one
with `php -r "echo bin2hex(random_bytes(32)), PHP_EOL;"` — either is fine,
just don't leave the placeholder `CHANGE_ME...` text).

### 2b. Edit `.env`

```
VITE_API_URL=https://yourdomain.com/backend
```

### 2c. Build the frontend

```bash
npm run build
```

This creates a `dist/` folder — that's everything the browser needs for the
public site and the admin panel UI.

---

## Part 3 — Upload the files

You can use hPanel's **File Manager** (works in the browser, no extra
software) or an FTP client like FileZilla with the credentials from
**Files → FTP Accounts**. Either way, the destination is the same.

### 3a. Upload the frontend
Open (or find) `public_html/` — this is your domain's document root.
Upload **the contents of `dist/`** (not the `dist` folder itself — its
*contents*: `index.html`, `assets/`, `favicon.png`, etc.) directly into
`public_html/`.

### 3b. Upload the backend
Upload the entire `backend/` folder into `public_html/`, so you end up with
`public_html/backend/...`. Make sure this includes your edited `config.php`
(not `config.example.php`) — File Manager sometimes hides dotfiles/certain
files by default, so double check `config.php` actually made it over.

**Do not upload** `backend/data/database.sqlite` if it exists locally —
you're using MySQL now, that file isn't needed and shouldn't go anywhere
public.

### 3c. Fix folder permissions
In File Manager, right-click `backend/uploads/` → **Permissions** → set to
`755` (or `775` if 755 gives upload errors later). This folder needs to be
writable by the web server for the admin panel's image upload to work.

---

## Part 4 — Create the database tables and content

### If you have SSH (from step 1c)

Connect via SSH (hPanel gives you the exact command, something like
`ssh u123456789@yourdomain.com -p 65002`), then:

```bash
cd public_html/backend
php bin/migrate.php
php bin/seed.php
php bin/create-admin.php you@real-email.com "a-strong-real-password"
```

Skip to Part 5.

### If you don't have SSH

**Create the tables and load your content:**

1. In hPanel, open **Databases → phpMyAdmin** and select your database.
2. Click the **SQL** tab.
3. Open `backend/db/setup-mysql.sql` in this project, copy its entire
   contents, paste into the SQL tab, and click **Go**.
   This creates all four tables (`admin_users`, `site_content`, `messages`,
   `visits`) and loads your current portfolio content into `site_content` —
   one paste does both.

**Create your admin login** (do this on your own computer — never send
your real password anywhere, including to me):

```bash
php -r "echo password_hash('a-strong-real-password', PASSWORD_BCRYPT), PHP_EOL;"
```

Copy the long string it prints (starts with `$2y$...`). Back in phpMyAdmin's
SQL tab, run (with your real email and the hash you just generated):

```sql
INSERT INTO admin_users (email, password_hash)
VALUES ('you@real-email.com', 'PASTE_THE_HASH_HERE');
```

---

## Part 5 — SSL (HTTPS)

In hPanel: **SSL** → make sure a certificate is active for your domain
(Hostinger issues free ones automatically for most plans — this can take a
few minutes to a few hours after a domain first points here). Both your
frontend and backend need to load over `https://` — a mix of http/https
between them gets silently blocked by the browser.

---

## Part 6 — Test everything

Visit `https://yourdomain.com` and check, in order:

1. **Homepage loads** — images, logo, favicon all show up
2. **Theme toggle** (sun/moon in the nav) switches day/night correctly
3. **Contact form** at the bottom submits without an error
4. **`/admin/login`** — sign in with the real email/password from Part 4
5. **`/admin` → Messages** — the test message you just submitted shows up
6. **`/admin` → Visitors** — reload the homepage in another tab, then check
   this tab shows a new visit within ~6 seconds
7. **`/admin` → Projects (or Profile)** — try the **Upload image** button on
   any image field, confirm it previews and saves

If step 7 fails with a server error, permissions from step 3c are the most
likely cause.

---

## Troubleshooting

**Login fails with "Unauthorized" even though the password is right**
Your host may be stripping the `Authorization` header. `backend/api/.htaccess`
already includes a fix for this (Apache/LiteSpeed), but if it's still
happening, contact Hostinger support and ask them to confirm
`mod_rewrite` is enabled for your account.

**Everything 500s under `/backend/api/...`**
Check `public_html/backend/config.php` actually exists and has correct DB
credentials. A missing/misconfigured `config.php` is the #1 cause.
(Hostinger's **File Manager** lets you view PHP error logs under
**Advanced → Error Logs** — check there for the exact message.)

**CORS errors in the browser console**
Double-check `cors_origins` in `config.php` exactly matches the URL bar —
`https://yourdomain.com` and `https://www.yourdomain.com` are different
origins; list both if your site answers on both.

**Images you upload from `/admin` don't show on the live site**
Confirm `public_url` in `config.php` is the real `https://yourdomain.com/backend`
— uploaded image URLs are built from this value.

**Contact form or admin panel don't appear at all (just blank quick-contact cards)**
That means `VITE_API_URL` wasn't set when you ran `npm run build` — go back
to step 2b/2c, rebuild, and re-upload `dist/`.

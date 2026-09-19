# Backend setup (PHP)

The site works today with zero setup — it reads from `src/data.js` and the Contact
section just shows quick-contact cards. Setting up the backend in `/backend` adds:

1. **An admin panel at `/admin`** — edit the bio, experience, projects, skills,
   education and contact info through a web UI instead of editing code, with
   an image upload button for photos/logos/project screenshots.
2. **A working contact form** — messages sent from the Contact section land in
   a private inbox at `/admin` instead of just opening the visitor's mail app.
3. **A live visitors feed** — the admin panel's Visitors tab shows page views
   as they happen (polling every few seconds) and can pop a browser
   notification while the tab is open.

Nothing here is required — the public site keeps working exactly as it does now
until you complete the steps below.

## How it's split

This is two separate things that get deployed separately:

- **The React site** (everything outside `/backend`) — a static build, hosted
  anywhere that serves static files (Vercel, Netlify, GitHub Pages, any web host).
- **The PHP API** (`/backend`) — needs an actual PHP host: shared hosting with
  cPanel, a VPS, or your own machine for local dev. Any PHP 7.4+ host with the
  `pdo_sqlite` or `pdo_mysql` extension works.

The React site talks to the PHP API over HTTP using the URL you set in
`VITE_API_URL` — they don't need to live on the same server or even the same domain.

## 1. Configure the backend

```bash
cd backend
cp config.example.php config.php
```

Edit `config.php`:

- **Database** — the default (`sqlite:.../data/database.sqlite`) needs zero setup
  and is fine for a low-traffic portfolio site. If your host gives you MySQL/MariaDB
  (typical on cPanel), swap the DSN to the commented-out `mysql:...` line instead
  and fill in your DB credentials.
- **`jwt_secret`** — replace with a long random string, e.g. generate one with:
  ```bash
  php -r "echo bin2hex(random_bytes(32)), PHP_EOL;"
  ```
- **`cors_origins`** — list every URL your frontend is actually served from
  (e.g. `http://localhost:5173` for dev, `https://your-domain.com` for prod).
- **`public_url`** — the URL this backend itself is reachable at. Uploaded
  images are served from here, so this needs to be correct for them to show
  up on the live site.

## 2. Create the database tables and load starter content

```bash
php backend/bin/migrate.php
php backend/bin/seed.php
```

`migrate.php` creates the tables (safe to re-run). `seed.php` loads the content
currently in `src/data.js` into the database — but only if the row is empty, so
running it again later never overwrites edits you've made from `/admin`.

## 3. Create your admin login

```bash
php backend/bin/create-admin.php you@example.com "a-strong-password"
```

This is the only account — there's no public sign-up page. Re-run it any time
to reset your password.

## 4. Point the frontend at the backend

Copy `.env.example` to `.env` and set `VITE_API_URL` to wherever the backend
will be reachable, e.g.:

```
VITE_API_URL=http://localhost:8000
```

Restart `npm run dev` after changing it (env vars are only read at startup).

## 5. Run it locally

In one terminal:

```bash
php -S localhost:8000 -t backend
```

In another:

```bash
npm run dev
```

Visit `/admin/login` and sign in with the account you created in step 3.

## Deploying

- **Frontend**: `npm run build`, deploy the `dist/` folder as usual.
- **Backend**: upload the whole `backend/` folder to your PHP host. Make sure
  `config.php` and `backend/data/*.sqlite` (if using SQLite) exist there and are
  **not** publicly downloadable — `backend/.htaccess` blocks direct access to
  everything except `backend/api/*` on Apache; if your host runs nginx, add an
  equivalent rule denying `/backend/` except `/backend/api/`.
- Update `VITE_API_URL` (in your hosting provider's env var settings) to the
  backend's public URL, and rebuild/redeploy the frontend.

## Notes

- **Image uploads** save into `backend/uploads/` and are served back at
  `{public_url}/uploads/<file>.{jpg,png,webp,gif}`, capped at 5MB. You can
  still paste a plain path or URL into the same field instead of uploading —
  both work.
- **Live visitors** works by polling, not push — it only updates while the
  admin dashboard's Visitors tab is open in a browser tab (including in the
  background), not as an OS notification when the tab/browser is fully
  closed. Getting the latter working would need a push-notification server
  (service worker + VAPID keys), which is a bigger separate feature.
- If `VITE_API_URL` isn't set, `/admin` shows a "Backend not configured" notice
  instead of erroring, and the Contact form hides itself (the quick-contact
  cards still work) — the rest of the site is unaffected either way.
- Login sessions are a signed token stored in the browser's localStorage, valid
  for 7 days — fine for a single-admin dashboard, but don't reuse this pattern
  for anything handling more sensitive data without hardening it further.

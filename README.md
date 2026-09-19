# Iyeose Uhumuavbi — Portfolio

A single-page portfolio built with React, Vite, Tailwind CSS v4, and Framer
Motion, with a PHP + MySQL/SQLite backend powering a content admin panel,
a working contact form, and a live visitors feed.

## Run locally

```bash
npm install
npm run dev
```

This alone gets you the public site, reading from `src/data.js` — no backend
required. To also run the admin panel and contact form locally, see
**Backend** below.

## Build for production

```bash
npm run build
npm run preview   # serve the production build locally to check it
```

The build outputs static files to `dist/`.

## Backend (admin panel, contact form, live visitors)

The `backend/` folder is a separate PHP application — it deploys
independently of the React site (it needs an actual PHP host; the frontend
doesn't). Full setup instructions: **[`BACKEND_SETUP.md`](BACKEND_SETUP.md)**.

Until the backend is configured (`VITE_API_URL` set in `.env`), the site
works exactly as a static site: content comes from `src/data.js` and the
Contact section shows quick-contact cards instead of a form.

## Editing content

With the backend set up, do this from `/admin` instead — it's easier and
doesn't need a rebuild/redeploy. Without it, edit directly:

- **Profile / bio / stats / photo** — `src/data.js` → `profile`, `stats`
- **Work experience** — `src/data.js` → `experience`
- **Projects** — `src/data.js` → `projects`
- **Skills** — `src/data.js` → `skillGroups`
- **Education** — `src/data.js` → `education`
- **Logo / favicon** — see the comments above `siteConfig` in `src/data.js`,
  and `index.html` for the favicon

## Project structure

```
src/                  React app (public site + admin panel)
  components/         Public site sections (Hero, About, Projects, ...)
  admin/              Admin panel (login, dashboard, per-section editors)
  context/            Live content fetched from the backend, with data.js as fallback
  lib/                API client for the PHP backend
backend/              Separate PHP app — API, auth, database, file uploads
  api/                HTTP entry points
  bin/                CLI setup scripts (migrate, seed, create-admin)
  db/                 SQL schema + starter content
public/               Static assets served as-is (images, favicon, .htaccess)
```

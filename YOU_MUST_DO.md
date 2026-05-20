# What you must do (only your tasks)

Everything else is built and pushed to GitHub.

## 1. MongoDB Atlas (required)

1. https://cloud.mongodb.com -> **Network Access** -> add your IP or `0.0.0.0/0`
2. Confirm database user password (rotate if anything was shared publicly)
3. Connection string in `server/.env` -> database name `urlshortener`

## 2. Local test (recommended)

```powershell
cd d:\URL_SHORTNER\server
npm run dev

cd d:\URL_SHORTNER\client
npm run dev
```

Open http://localhost:5173 - signup, create link, redirect, analytics, bulk CSV, edit, delete.

## 3. Deploy

Follow `DEPLOY.md`.

Deployed URLs (current):

- Frontend: https://linkforge-url-shortener.vercel.app/
- Backend: https://shortly-url-shortener-hefw.onrender.com/

## 4. README (before submit)

Edit `README.md`:

- Live frontend URL
- Live backend URL
- Loom or YouTube video link
- Optional: screenshots in `docs/screenshots/`


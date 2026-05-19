# What you must do (only your tasks)

Everything else is built and pushed to GitHub. Complete these before **12 PM, Thursday, May 21, 2026**.

## 1. MongoDB Atlas (required to run app)

1. [cloud.mongodb.com](https://cloud.mongodb.com) → **Network Access** → add your IP or `0.0.0.0/0`
2. Confirm database user password (rotate if `URL:URL` was ever shared publicly)
3. Connection string in `server/.env` → database name `urlshortener`

## 2. Local test (recommended)

```powershell
cd d:\URL_SHORTNER\server
npm run dev

cd d:\URL_SHORTNER\client
npm run dev
```

Open http://localhost:5173 — signup, create link, redirect, analytics, bulk CSV, edit, delete.

## 3. Deploy

Follow [DEPLOY.md](./DEPLOY.md):

- Render → backend (`server/`)
- Vercel → frontend (`client/`, set `VITE_API_URL`)
- Render → set `FRONTEND_URL` to Vercel URL

## 4. README (before submit)

Edit [README.md](./README.md):

- Live frontend URL
- Live backend URL
- **Loom or YouTube video link** (mandatory — no video = not reviewed)
- Optional: screenshots in `docs/screenshots/`

## 5. Record demo video (~6–8 min)

Show: auth, create link, redirect, analytics (chart + QR + country), bulk CSV, edit, delete, public `/stats`, brief DB/encryption mention.

## 6. Submit Google Form

- GitHub: https://github.com/jjeganvijay/linkforge-url-shortener
- [Submission form](https://docs.google.com/forms/d/e/1FAIpQLSeXnTUOF_6lHJyGbG_ES6nr4rsbphjCg1AumA0BxpKGyENR5g/viewform)
- Deadline: **12 PM, May 21, 2026**

## 7. Interview prep

Read [AI-PROMPTS.md](./AI-PROMPTS.md) and be ready to run and explain the code live.

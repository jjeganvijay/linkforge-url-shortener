# Deploy Shortly (Render + Vercel)

Deploy **backend first**, then **frontend**. Copy URLs into `README.md` when done.

---

## Step 0 - MongoDB Atlas

1. https://cloud.mongodb.com -> your cluster.
2. **Network Access** -> **Add IP Address** -> **Allow Access from Anywhere** (`0.0.0.0/0`) so Render can connect.
3. **Database Access** -> user with read/write on database `urlshortener`.
4. **Connect** -> copy connection string, e.g.
   `mongodb+srv://USER:PASSWORD@cluster0.ao4snqn.mongodb.net/urlshortener?retryWrites=true&w=majority&appName=Cluster0`

Generate encryption key (run once, save it - changing it breaks existing encrypted links):

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

---

## Step 1 - Render (API)

1. https://dashboard.render.com -> **New** -> **Blueprint** (or **Web Service**).
2. Connect GitHub repo: `jjeganvijay/linkforge-url-shortener`.
3. If using Blueprint: Render reads `render.yaml` (root dir `server`, health check `/api/health`).
4. If manual Web Service:
   - **Root Directory:** `server`
   - **Build Command:** `npm ci`
   - **Start Command:** `npm start`
   - **Health Check Path:** `/api/health`

### Environment variables (Render -> Environment)

| Key | Example / notes |
|-----|-----------------|
| `MONGODB_URI` | Your Atlas SRV string |
| `JWT_SECRET` | Long random string (32+ chars) |
| `ENCRYPTION_KEY` | 64-character hex from Step 0 |
| `BASE_URL` | `https://shortly-url-shortener-hefw.onrender.com` (no trailing slash) |
| `FRONTEND_URL` | `https://linkforge-url-shortener.vercel.app` (no trailing slash) |
| `NODE_ENV` | `production` |
| `GOOGLE_CLIENT_ID` | Optional: Google client id |

5. **Deploy** -> wait until **Live**.
6. Test: open `https://shortly-url-shortener-hefw.onrender.com/api/health` -> should return JSON success.

Note: Free tier sleeps after idle; first request may take ~30s.

---

## Step 2 - Vercel (React)

1. https://vercel.com/new -> import `jjeganvijay/linkforge-url-shortener`.
2. **Root Directory:** `client`
3. Framework: **Vite** (auto-detected).
4. **Environment variables:**

| Key | Value |
|-----|-------|
| `VITE_API_URL` | `https://shortly-url-shortener-hefw.onrender.com/api` |
| `VITE_GOOGLE_CLIENT_ID` | Optional: Google client id |

5. **Deploy** -> copy production URL (example: `https://linkforge-url-shortener.vercel.app`).

---

## Step 3 - Link frontend <-> backend

1. **Render** -> set `FRONTEND_URL` to your exact Vercel URL (no trailing slash).
2. Redeploy Render (or wait for auto-redeploy).
3. Open Vercel app -> sign up -> create a short link -> test redirect.

---

## Step 4 - README (before submit)

In `README.md`, set:

- **Frontend:** your Vercel URL
- **Backend:** your Render URL
- **Demo video:** Loom/YouTube link

Bottom line must remain:

`This project is a part of a hackathon run by https://katomaran.com`

---

## Troubleshooting

| Issue | Fix |
|-------|-----|
| CORS error in browser | `FRONTEND_URL` on Render must match Vercel URL exactly (`https://...`) |
| MongoDB connection failed | Atlas IP allowlist + correct `MONGODB_URI` |
| Short links 404 | `BASE_URL` on Render must be your Render service URL |
| API slow first load | Render free tier cold start - normal for demo |
| `ENCRYPTION_KEY` error | Must be exactly 64 hex characters |


# AI prompts used (interview reference)

Summaries of prompts used while building LinkForge. Be ready to explain what you changed after generation.

---

## 1. Architecture and planning

> Analyze the Katomaran URL shortener hackathon requirements. Propose a monorepo folder structure with React (Vite) frontend and Express backend, MongoDB models for Users, Links, and Visits. List mandatory vs bonus features and a 4-day build order.

**Outcome:** `client/` + `server/` layout, feature checklist in `AI-PLANNING.md`.

---

## 2. Backend authentication

> Create Express auth with Mongoose: User model (name, email, passwordHash), signup and login routes, bcrypt with 12 salt rounds, JWT middleware protecting routes, express-validator for email and password.

**Outcome:** `authController.js`, `auth.js` middleware, `authRoutes.js`.

---

## 3. URL encryption and shortening

> Add Link model and POST /api/links: validate HTTP/HTTPS URL, generate unique 7-character short code or optional custom alias, encrypt the original URL with AES-256-GCM (store encrypted text, IV, and auth tag separately). Never store plain URLs.

**Outcome:** `encrypt.js`, `linkController.js` create flow.

---

## 4. Redirect and analytics

> Implement GET /:shortCode on the server: find link, check expiry, parse user-agent for device/browser/OS, insert Visit document, increment clickCount, decrypt URL, return 302 redirect. Add GET /api/analytics/:id for owner with total clicks, last visit, last 20 visits, and daily aggregation for 30 days.

**Outcome:** `analyticsController.js`, `redirectRoutes.js`.

---

## 5. React dashboard UI

> Build a React dashboard with Tailwind: dark theme, create-link form with custom alias and expiry, link cards showing short URL, original URL, created date, clicks, copy button, delete with confirm, link to analytics page. Use react-hot-toast and loading/error states.

**Outcome:** `Dashboard.jsx`, `LinkCard.jsx`, auth pages.

---

## 6. Analytics page and charts

> Create analytics page with total clicks, last visited time, recent visits table, Recharts bar chart for daily clicks, and QR code for the short URL using qrcode.react.

**Outcome:** `Analytics.jsx`.

---

## 7. Bulk CSV and geolocation

> Add POST /api/links/bulk accepting CSV text (one URL per line, optional alias). Add geoip-lite country on each visit. Dashboard bulk upload textarea and country column in analytics.

**Outcome:** `bulkCreateLinks`, `BulkUpload.jsx`, `geoip.js`, country on visits.

---

## 8. Deployment

> Add render.yaml for Node server in /server with health check /api/health, vercel.json for Vite SPA rewrites, and CORS allowing FRONTEND_URL from environment.

**Outcome:** `render.yaml`, `client/vercel.json`, `DEPLOY.md`.

---

## What you should explain in the interview

- Why short codes stay plain but **long URLs are encrypted** in MongoDB  
- How **JWT** protects `/api/links` and `/api/analytics`  
- Why redirect must be **server-side** (not React Router only)  
- How you tested uniqueness of `shortCode` and custom alias conflicts  

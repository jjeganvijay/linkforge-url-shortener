# AI Planning Document — URL Shortener Hackathon

## 1. Problem Understanding

Build a full-stack URL Shortener where authenticated users create short links, track click analytics, and manage links from a dashboard. URLs are encrypted at rest for security. Server handles redirects and logs every visit.

## 2. Features Planned

### Mandatory Features
- [x] User signup and login with JWT authentication
- [x] Protected dashboard routes (React Router + JWT middleware)
- [x] Each user manages only their own links
- [x] URL validation before shortening
- [x] Unique short code generation
- [x] Server-side redirect (302) on short URL click
- [x] Dashboard: list links with original URL, short URL, created date, clicks
- [x] Delete shortened URL
- [x] Copy short URL from UI
- [x] Click count per link
- [x] Timestamp recorded for each visit
- [x] Analytics page: total clicks, last visited, recent visit history
- [x] Responsive UI with loading, success, and error states
- [x] Form validation messages

### Security Enhancements
- [x] bcrypt password hashing (12 salt rounds)
- [x] AES-256-GCM encryption of original URLs at rest
- [x] JWT token authentication (7-day expiry)
- [x] Rate limiting on auth, link creation, and redirects
- [x] Helmet.js security headers
- [x] User-scoped data access on all link operations

### Bonus Features
- [x] Custom alias for short URLs
- [x] QR code generation per link
- [x] Link expiry date
- [x] Device/browser/OS analytics via user-agent parsing
- [x] Daily click trend charts (Recharts)
- [x] Public stats API endpoint
- [x] Edit destination URL (PATCH endpoint)

## 3. AI Workflow Steps

1. **Planning** — Used Claude to analyze hackathon requirements and design monorepo architecture
2. **Scaffolding** — Generated folder structure, package.json files, and environment config
3. **Backend Auth** — AI-generated Express auth module; manually reviewed JWT flow and bcrypt integration
4. **URL Encryption** — Implemented AES-256-GCM utility; understood IV + auth tag pattern before deploying
5. **Redirect Logic** — Built server-side redirect route; verified 302 response and visit logging
6. **Frontend** — Generated React components with Tailwind CSS; customized dark theme dashboard
7. **Analytics** — Added MongoDB aggregation for daily clicks and Recharts visualization
8. **Testing** — Manual end-to-end test: signup → create link → redirect → analytics → delete

## 4. Assumptions

- Short codes are 7 random alphanumeric characters (or custom alias 3-20 chars)
- Maximum URL length: 2048 characters
- Visit history displays last 20 visits
- JWT tokens expire after 7 days
- Encryption key is stored in environment variables, never in source code
- MongoDB Atlas hosts the production database
- Frontend runs on port 5173, backend on port 5000

## 5. Architecture

See [ARCHITECTURE.md](./ARCHITECTURE.md) for the full diagram.

## 6. Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite, Tailwind CSS, Recharts |
| Backend | Node.js, Express |
| Database | MongoDB Atlas (Mongoose ODM) |
| Auth | JWT + bcrypt |
| Encryption | AES-256-GCM (Node.js crypto) |
| QR Codes | qrcode (server) + qrcode.react (client) |

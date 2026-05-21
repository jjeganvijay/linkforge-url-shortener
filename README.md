# Shortly - URL Shortener with Analytics

A full-stack URL shortener built for the Katomaran Technologies Hackathon 2026. Create short links, track click analytics, and manage everything from a secure dashboard. Original URLs are encrypted at rest using AES-256-GCM.

## Live Demo

Live links:

- **Frontend:** `https://linkforge-url-shortener.vercel.app/`
- **Backend:** `https://shortly-url-shortener-hefw.onrender.com/`

## Demo Video

- **Video (Loom):** `https://www.loom.com/share/4469d5a4883f40b8b1297ebff47b57f6`

## Features

### Core
- User authentication (signup/login with JWT)
- URL shortening with unique short codes
- Server-side redirect handling
- Click analytics with visit timestamps
- User dashboard with copy/delete actions

### Security
- bcrypt password hashing
- AES-256-GCM URL encryption at rest
- Rate limiting on sensitive endpoints
- User-scoped data access

### Bonus
- Custom alias for short URLs
- QR code generation
- Link expiry dates
- Device/browser/OS analytics
- Daily click trend charts
- Public stats API
- Edit destination URL
- Bulk URL shortening via CSV
- Country geolocation on visits (geoip-lite)

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React, Vite, Tailwind CSS, Recharts |
| Backend | Node.js, Express |
| Database | MongoDB Atlas |
| Auth | JWT + bcrypt |
| Encryption | AES-256-GCM |

## Project Structure

```
URL_SHORTNER/
├── client/          # React frontend
├── server/          # Express backend
├── AI-PLANNING.md   # AI workflow documentation
├── ARCHITECTURE.md  # Architecture diagrams
└── README.md
```

## Setup Instructions

### Prerequisites
- Node.js 18+
- MongoDB Atlas account

### 1. Clone the repository

```bash
git clone https://github.com/jjeganvijay/linkforge-url-shortener.git
cd linkforge-url-shortener
```

### 2. Backend setup

```bash
cd server
copy .env.example .env
# On macOS/Linux: cp .env.example .env
# Edit .env: set MONGODB_URI (Atlas), JWT_SECRET, and ENCRYPTION_KEY (64 hex chars)
npm install
npm run dev
```

Server runs at `http://localhost:5000`

### 3. Frontend setup

```bash
cd client
copy .env.example .env
# Default VITE_API_URL=/api uses Vite proxy to the backend on port 5000
npm install
npm run dev
```

Frontend runs at `http://localhost:5173`

### Environment Variables

**Server (`server/.env`):**

| Variable | Description |
|----------|-------------|
| `PORT` | Server port (default: 5000) |
| `MONGODB_URI` | MongoDB Atlas connection string |
| `JWT_SECRET` | Secret for JWT signing |
| `ENCRYPTION_KEY` | 64-char hex string (32 bytes for AES-256) |
| `GOOGLE_CLIENT_ID` | (Optional) Google OAuth client id for Google sign-in |
| `FRONTEND_URL` | Frontend URL for CORS |
| `BASE_URL` | Backend base URL for short links |

**Client (`client/.env`):**

| Variable | Description |
|----------|-------------|
| `VITE_API_URL` | Backend API URL |
| `VITE_GOOGLE_CLIENT_ID` | (Optional) Google client id for the Google button |

Generate an encryption key:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

## Assumptions

- Short codes are 7 random alphanumeric characters (custom alias: 3-20 chars)
- JWT tokens expire after 7 days
- Visit history shows the last 20 visits
- Daily click charts cover the last 30 days
- Encryption key must be a 64-character hex string

## Sample Output

Add screenshots after local or live testing (`docs/screenshots/`). Example document shapes in MongoDB:

**users**
```json
{
  "_id": "...",
  "name": "Demo User",
  "email": "demo@example.com",
  "passwordHash": "$2a$12$...",
  "createdAt": "2026-05-18T10:00:00.000Z"
}
```

**links** (original URL is encrypted — `encryptedUrl` is not human-readable)
```json
{
  "shortCode": "abc12xy",
  "encryptedUrl": "a1b2c3...",
  "urlIv": "...",
  "urlAuthTag": "...",
  "clickCount": 5,
  "userId": "..."
}
```

**visits**
```json
{
  "linkId": "...",
  "visitedAt": "2026-05-18T10:05:00.000Z",
  "device": "desktop",
  "browser": "Chrome",
  "os": "Windows"
}
```

## API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/signup` | No | Register |
| POST | `/api/auth/login` | No | Login |
| POST | `/api/auth/google` | No | Login with Google (ID token) |
| GET | `/api/auth/me` | Yes | Current user |
| DELETE | `/api/auth/me` | Yes | Delete account (also deletes links + visits) |
| POST | `/api/links` | Yes | Create link |
| POST | `/api/links/bulk` | Yes | Bulk create from CSV text |
| GET | `/api/links` | Yes | List links |
| DELETE | `/api/links/:id` | Yes | Delete link |
| PATCH | `/api/links/:id` | Yes | Edit URL |
| GET | `/api/links/:id/qr` | Yes | QR code |
| GET | `/api/analytics/:id` | Yes | Analytics |
| GET | `/api/public/:shortCode/stats` | No | Public stats |
| GET | `/:shortCode` | No | Redirect |

## Documentation

- [AI Planning Document](./AI-PLANNING.md)
- [Architecture Diagrams](./ARCHITECTURE.md)
- [Deployment Guide](./DEPLOY.md)
- [Submission Checklist](./SUBMISSION.md)
- [AI Prompts (interview prep)](./AI-PROMPTS.md)

## Public stats page

Visit `/stats` on the frontend to look up click count for any short code (uses `GET /api/public/:shortCode/stats`).

---

This project is a part of a hackathon run by https://katomaran.com

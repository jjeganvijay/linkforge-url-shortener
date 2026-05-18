# Architecture — URL Shortener

## System Overview

```mermaid
flowchart TB
    subgraph Client["React Frontend (Vite)"]
        AuthPages["Login / Signup"]
        Dashboard["Dashboard"]
        AnalyticsPage["Analytics Page"]
    end

    subgraph Server["Express API (Node.js)"]
        AuthAPI["/api/auth"]
        LinksAPI["/api/links"]
        AnalyticsAPI["/api/analytics"]
        Redirect["GET /:shortCode"]
        Encrypt["AES-256-GCM Encrypt/Decrypt"]
    end

    subgraph Database["MongoDB Atlas"]
        Users[(Users)]
        Links[(Links)]
        Visits[(Visits)]
    end

    AuthPages -->|JWT| AuthAPI
    Dashboard -->|REST| LinksAPI
    AnalyticsPage -->|REST| AnalyticsAPI
    AuthAPI --> Users
    LinksAPI --> Encrypt
    Encrypt --> Links
    AnalyticsAPI --> Visits
    Redirect -->|Log visit + decrypt URL| Links
    Redirect --> Visits
    Visitor["External Visitor"] -->|Click short link| Redirect
    Redirect -->|302 Redirect| OriginalSite["Original Website"]
```

## Data Flow: Create Link

```mermaid
sequenceDiagram
    participant U as User
    participant F as React Frontend
    participant A as Express API
    participant E as AES Encrypt
    participant D as MongoDB

    U->>F: Enter long URL
    F->>A: POST /api/links (JWT)
    A->>A: Validate URL format
    A->>A: Generate unique shortCode
    A->>E: Encrypt original URL
    E-->>A: encryptedUrl + IV + authTag
    A->>D: Save Link document
    D-->>A: Link created
    A-->>F: Return short URL
    F-->>U: Display in dashboard
```

## Data Flow: Redirect & Analytics

```mermaid
sequenceDiagram
    participant V as Visitor
    participant A as Express API
    participant D as MongoDB
    participant E as AES Decrypt
    participant W as Original Website

    V->>A: GET /abc123
    A->>D: Find link by shortCode
    A->>A: Check expiry
    A->>D: Create Visit record
    A->>D: Increment clickCount
    A->>E: Decrypt original URL
    E-->>A: Original URL
    A->>W: 302 Redirect
    W-->>V: Load page
```

## Database Schema

### Users Collection
```
{
  _id: ObjectId,
  name: String,
  email: String (unique),
  passwordHash: String,
  createdAt: Date,
  updatedAt: Date
}
```

### Links Collection
```
{
  _id: ObjectId,
  userId: ObjectId (ref: Users),
  shortCode: String (unique, indexed),
  encryptedUrl: String,
  urlIv: String,
  urlAuthTag: String,
  customAlias: String | null,
  expiresAt: Date | null,
  isActive: Boolean,
  clickCount: Number,
  createdAt: Date,
  updatedAt: Date
}
```

### Visits Collection
```
{
  _id: ObjectId,
  linkId: ObjectId (ref: Links, indexed),
  visitedAt: Date (indexed),
  ip: String,
  userAgent: String,
  device: String,
  browser: String,
  os: String
}
```

## Security Architecture

| Layer | Mechanism |
|-------|-----------|
| Passwords | bcrypt (12 salt rounds) |
| URLs at rest | AES-256-GCM encryption |
| API access | JWT Bearer tokens |
| Brute force | express-rate-limit |
| HTTP headers | Helmet.js |
| CORS | Restricted to frontend URL |
| Data isolation | userId filter on all queries |

## API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | /api/auth/signup | No | Register user |
| POST | /api/auth/login | No | Login, get JWT |
| GET | /api/auth/me | Yes | Current user |
| POST | /api/links | Yes | Create short link |
| GET | /api/links | Yes | List user's links |
| DELETE | /api/links/:id | Yes | Delete link |
| PATCH | /api/links/:id | Yes | Edit destination URL |
| GET | /api/links/:id/qr | Yes | Get QR code |
| GET | /api/analytics/:id | Yes | Link analytics |
| GET | /api/public/:shortCode/stats | No | Public click count |
| GET | /:shortCode | No | Redirect + log visit |

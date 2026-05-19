# Production readiness — LinkForge

## Login & sessions

| Behavior | Detail |
|----------|--------|
| **Stay logged in?** | Yes, on the same browser/device until you **log out** or the **JWT expires (7 days)**. |
| **Storage** | Token in `localStorage` (standard for SPAs). |
| **After 7 days** | API returns 401 → redirect to login with “session expired” message. |
| **Invalid token** | Cleared automatically; user must sign in again. |
| **Logout** | Clears token immediately. |

This matches how many real products work (GitHub, Notion-style apps use similar session length). For stricter security you could shorten JWT expiry or use httpOnly cookies (more setup).

## Security checklist (deploy)

- [ ] Strong `JWT_SECRET` (32+ random characters)
- [ ] Unique `ENCRYPTION_KEY` (64 hex chars) — never change after links exist
- [ ] MongoDB user with least privilege; IP allowlist on Atlas
- [ ] `FRONTEND_URL` = exact Vercel URL on Render
- [ ] `BASE_URL` = exact Render API URL
- [ ] Rotate any credentials ever shared in chat

## Verified behaviors

- Auth restore on page refresh (`/auth/me`)
- Protected routes wait for auth check (no flash redirect)
- 401 on expired token → login with message (not on failed login attempt)
- Reserved short codes (`api`, `login`, etc.) cannot be used
- Expired / missing links → friendly `/link-error` page
- 404 page for unknown routes
- Request body size limit (100kb)
- Env validation on server start

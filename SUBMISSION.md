# Hackathon submission checklist

**Deadline:** 12 PM, Thursday, May 21, 2026  
**Form:** Use the link from your Katomaran email  
**Repo:** https://github.com/jjeganvijay/linkforge-url-shortener

## Before you submit

- [ ] Deploy API on Render (`DEPLOY.md`)
- [ ] Deploy frontend on Vercel (`DEPLOY.md`)
- [ ] Set `FRONTEND_URL` on Render to your Vercel URL
- [ ] Test live: signup → create link → open short URL → analytics
- [ ] Record **Loom or YouTube** demo (required — no video = not reviewed)
- [ ] Update `README.md` with live URLs and video link
- [ ] Add 2–3 screenshots to `docs/screenshots/` (optional but recommended)
- [ ] Submit GitHub URL on Google Form

## Demo video must show

1. Signup and login  
2. Create short link (with validation)  
3. Copy link and open in new tab → redirect works  
4. Dashboard click count updates  
5. Analytics page (visits, chart, QR)  
6. Edit destination URL  
7. Delete link  
8. Brief mention: encrypted URLs in DB, JWT auth  
9. (Optional) Public stats at `/stats`

## Interview prep

- Read [AI-PROMPTS.md](./AI-PROMPTS.md) — explain prompts you used  
- Be ready to run the app locally or on live URL  
- Understand `encrypt.js`, redirect route, and JWT middleware  

## README requirements (evaluators)

- [x] Setup instructions  
- [x] Assumptions  
- [x] AI planning doc + architecture diagram  
- [ ] Loom/YouTube link — **you add after recording**  
- [x] Hackathon line at bottom of README  
- [ ] Sample output (screenshots / DB) — add after testing  

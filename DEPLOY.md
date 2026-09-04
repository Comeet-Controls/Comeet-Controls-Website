# Comeet Controls – Deployment Guide
## Zero-Cost Deployment on Vercel

---

## Step 1: Set Up Gmail App Password

1. Sign in to your Google Account → **myaccount.google.com**
2. Go to **Security** → Enable **2-Step Verification** (if not already)
3. Go to **Security** → **App Passwords**
4. Choose App = "Mail", Device = "Other" → type "Comeet Website"
5. Google generates a 16-character password → **copy it**

---

## Step 2: Create `.env.local` File

In the `comeet-website` folder, create `.env.local`:

```
GMAIL_USER=your-gmail@gmail.com
GMAIL_APP_PASSWORD=xxxx xxxx xxxx xxxx
CONTACT_RECIPIENT=sales@comeetindia.com
```

> **NEVER commit this file to GitHub.** It is already in `.gitignore`.

---

## Step 3: Test Locally

```bash
cd comeet-website
npm run dev
```

Open http://localhost:3000 and test the contact form.

---

## Step 4: Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit - Comeet Controls website"
# Create a repo on github.com, then:
git remote add origin https://github.com/YOUR_USERNAME/comeet-website.git
git push -u origin main
```

---

## Step 5: Deploy to Vercel (Free)

1. Go to **vercel.com** → Sign in with GitHub
2. Click **"Add New Project"** → Import your `comeet-website` repo
3. **Add Environment Variables** (in Vercel dashboard):
   - `GMAIL_USER` = your Gmail
   - `GMAIL_APP_PASSWORD` = the 16-char App Password
   - `CONTACT_RECIPIENT` = `sales@comeetindia.com`
4. Click **Deploy**

Vercel auto-builds on every `git push`. Live URL will be something like:
`https://comeet-controls.vercel.app`

---

## Step 6: Custom Domain (Optional)

In Vercel → Project → Settings → Domains:
- Add `www.comeetindia.com`
- Vercel gives you DNS records to add in your domain registrar
- **SSL certificate is automatic and free**

---

## Monthly Cost Summary

| Service                   | Cost      |
|---------------------------|-----------|
| Vercel Hosting            | ₹0        |
| Gmail SMTP                | ₹0        |
| SSL Certificate           | ₹0        |
| CDN (via Vercel)          | ₹0        |
| Domain renewal (optional) | ~₹800/yr  |
| **TOTAL**                 | **≈ ₹0** |

---

## Local Development Commands

| Command         | Action                              |
|-----------------|-------------------------------------|
| `npm run dev`   | Start local server at localhost:3000 |
| `npm run build` | Build for production                 |
| `npm run start` | Run production build locally         |
| `npm run lint`  | Check for code issues                |

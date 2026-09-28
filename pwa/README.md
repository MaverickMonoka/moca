# MOCA — deployable app

This folder is the whole app. It's a static, installable web app (PWA) — no build step, no server, no database. Everything a shop owner enters is stored in their own browser (localStorage) on their own device.

## Files
- `index.html` — the app
- `manifest.webmanifest`, `sw.js`, `icon-192.png`, `icon-512.png`, `apple-touch-icon.png` — make it installable ("Add to Home Screen") and usable offline after the first load
- `_redirects` — Netlify routing (keeps this a single page)

## Deploy in under a minute

**Netlify (drag and drop)**
1. Go to https://app.netlify.com/drop
2. Drag this whole `moca-deploy` folder onto the page
3. Netlify gives you a live URL immediately (you can rename the site and add a custom domain after)

**Vercel**
1. Go to https://vercel.com/new
2. Choose "Deploy without Git" / drag-and-drop this folder, or run `npx vercel` from inside it
3. Vercel gives you a live URL

**GitHub Pages**
1. Push this folder's contents to a GitHub repo
2. Repo Settings → Pages → deploy from the branch/folder
3. Your app is live at `https://<username>.github.io/<repo>/`

**Any other static host** (Cloudflare Pages, Firebase Hosting, your own server) — just upload these files as-is. No build command, no environment variables.

## Installing it as an app
Once it's live, open the URL on a phone:
- **Android (Chrome):** menu → "Add to Home screen" / "Install app"
- **iPhone (Safari):** Share button → "Add to Home Screen"

It then opens full-screen with the MOCA icon, like a native app, and keeps working without signal once it's been opened once.

## Important: data lives on the device
There is no backend. Each phone/browser has its own separate data. To move data between devices, or to share one shop's data across several staff phones, use **Settings → Back up** in the app to copy a backup, and **Settings → Restore** on the other device.

If you want real multi-device sync (one shop, several phones, all seeing the same live stock and sales), that needs a real backend — Supabase is the natural next step, and I can wire that in.

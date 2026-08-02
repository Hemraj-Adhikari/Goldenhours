# Golden Hours — FAANG Roadmap Tracker

A personal web app for tracking your daily routine (Mon–Fri + weekend) and your
4-year roadmap to a FAANG-style engineering job. Check things off every day,
see a GitHub-style consistency graph of your discipline, and sync it across
devices with Firebase.

**Quick summary (Nepali):** Yo app local ma chalauna, GitHub ma push garna,
Firebase connect garna, ani Vercel ma deploy garna ko step-by-step tarika
tala cha. Sabai command copy-paste garera chalauna sakinchha.

---

## What's inside

- **Today** — live checklist for whatever day it is (weekday routine vs.
  Saturday deep-work vs. Sunday revision), with a progress ring and a
  highlight on your daily "golden hours."
- **Roadmap** — the 4-year plan (Year 1 Foundation → Year 4 Interview Prep),
  each with its own checklist and progress bar.
- **Consistency** — a commit-graph-style heatmap of how many days you actually
  followed through, plus current/best streak.
- Sign in with Google to sync progress to Firestore. Without signing in, it
  still works and saves locally in your browser ("demo mode").

All the routine/roadmap content lives in one file: `src/data/plan.js`. Edit
that to change tasks, times, or years — the whole UI reads from it.

## 1. Run it locally

You need [Node.js](https://nodejs.org) 18+ installed.

```bash
npm install
npm run dev
```

Open the printed `localhost` URL. It'll work immediately in **demo mode**
(saved to your browser only) — you don't need Firebase set up just to try it.

## 2. Connect Firebase (so progress syncs across devices)

1. Go to the [Firebase console](https://console.firebase.google.com) → **Add
   project** → follow the steps (Google Analytics is optional, skip it).
2. Inside the project: **Build → Authentication → Get started → Sign-in
   method → Google → Enable**. Save.
3. **Build → Firestore Database → Create database** → start in **production
   mode** → pick a region close to you.
4. Deploy the security rules already included in this repo
   (`firestore.rules`, restricts each user to their own data) — easiest way:
   in the Firestore console go to **Rules** tab and paste the contents of
   `firestore.rules`, then **Publish**.
5. **Project settings (gear icon) → General → Your apps → Web (`</>`)** →
   register an app (any nickname) → copy the `firebaseConfig` values shown.
6. In this project, copy `.env.example` to `.env`:

   ```bash
   cp .env.example .env
   ```

   Paste the matching values in:

   ```
   VITE_FIREBASE_API_KEY=...
   VITE_FIREBASE_AUTH_DOMAIN=...
   VITE_FIREBASE_PROJECT_ID=...
   VITE_FIREBASE_STORAGE_BUCKET=...
   VITE_FIREBASE_MESSAGING_SENDER_ID=...
   VITE_FIREBASE_APP_ID=...
   ```

7. Restart `npm run dev`. You should now see a **Sync with Google** button in
   the sidebar instead of the "demo mode" banner.

`.env` is git-ignored, so your real keys never get pushed to GitHub.

## 3. Push to GitHub

```bash
git init
git add .
git commit -m "Golden Hours tracker"
gh repo create golden-hours-tracker --private --source=. --push
```

(No `gh` CLI? Create an empty repo on github.com, then:)

```bash
git remote add origin https://github.com/<your-username>/golden-hours-tracker.git
git branch -M main
git push -u origin main
```

## 4. Deploy on Vercel

1. Go to [vercel.com](https://vercel.com) → **Add New → Project** → import
   the GitHub repo you just pushed. Vercel auto-detects Vite — no config
   needed.
2. Before deploying, open **Environment Variables** and add the same six
   `VITE_FIREBASE_*` keys from your `.env` file.
3. **Deploy**. You'll get a live URL (e.g. `golden-hours-tracker.vercel.app`).
4. Back in the Firebase console: **Authentication → Settings → Authorized
   domains** → add your Vercel domain, or Google sign-in will be blocked
   there.

Every future `git push` to `main` auto-redeploys.

## Notes

- If you ever add a mobile app or a second device, sign in with the same
  Google account — Firestore keeps everything in sync in real time.
- Update the routine/roadmap any time by editing `src/data/plan.js` and
  pushing — no other file needs to change.
- Firestore's free tier is generous enough for a single-user tracker like
  this; you won't hit billing for normal daily use.

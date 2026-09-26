# Daybook — a quiet little to-do app

A clean, minimal to-do app backed by Firebase's free Spark plan. ₹0 cost, no credit card needed.

## Setup (5 minutes)

### 1. Create your Firebase project
1. Go to https://console.firebase.google.com → **Add project**, name it (e.g. `daybook-todo`). Skip Google Analytics.
2. Click the **</>** (web) icon → give it a nickname → **Register app** (skip Hosting for now).
3. Copy the `firebaseConfig` values Firebase shows you.

### 2. Add your config
Open `firebase-config.js` and paste your values over the `PASTE_…` placeholders.

### 3. Create the Firestore database
Firebase console → **Build → Firestore Database** → **Create database** → **Start in test mode** → pick the region closest to you (e.g. `asia-south1` for India).

### 4. Run it locally
Just open `index.html` in your browser — no build step.
(If the browser blocks ES module imports from `file://`, run `npx serve .` or use the VS Code "Live Server" extension instead.)

### 5. Deploy for free with Firebase Hosting
```bash
npm install -g firebase-tools
firebase login
firebase init hosting     # choose your project; public dir = .  (firebase.json is already set up)
firebase deploy           # → https://daybook-todo.web.app
```
`firebase.json` and `.firebaserc` in this folder are pre-configured — after `firebase login`, `firebase deploy` just works.

## Tighten security before sharing publicly
Test-mode rules allow anyone with your project ID to read/write. For a personal app that's fine; for anything shared, add Firebase Authentication and restrict rules to signed-in users:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /tasks/{taskId} {
      allow read, write: if request.auth != null;
    }
  }
}
```

## Files
- `index.html` — structure (+ Firebase SDK import map)
- `style.css` — the "Daybook" paper/journal look
- `firebase-config.js` — your Firebase credentials (paste values here)
- `script.js` — add/complete/delete, synced live with Firestore
- `firebase.json` / `.firebaserc` — Hosting config (deploy-ready)

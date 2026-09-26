// ─── Daybook Firebase config ──────────────────────────────────────────────
// 1. Go to https://console.firebase.google.com → Add project (e.g. "daybook-todo")
// 2. Click the </> (web) icon → Register app → copy the firebaseConfig values
// 3. Paste them below, replacing every PASTE_… placeholder.
// The apiKey here is public by design — Firebase secures data via security rules,
// not by hiding this key. Still, keep Firestore rules tight (see README).

export const firebaseConfig = {
  apiKey: "PASTE_YOUR_API_KEY",
  authDomain: "PASTE_YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "PASTE_YOUR_PROJECT_ID",
  storageBucket: "PASTE_YOUR_PROJECT_ID.firebasestorage.app",
  messagingSenderId: "PASTE_YOUR_SENDER_ID",
  appId: "PASTE_YOUR_APP_ID"
};

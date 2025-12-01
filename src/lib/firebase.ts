import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// NOTE: These values should be provided via Vite environment variables.
// See `.env.example` for variable names and add a local `.env` in the root of frontend.
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Analytics is client/DOM-only — only attempt to init if in the browser and `measurementId` is present.
let analytics;
if (typeof window !== "undefined" && firebaseConfig.measurementId) {
  try {
    analytics = getAnalytics(app);
  } catch (err) {
    // Analytics can fail when the environment isn't suited for it (SSR, test runners, etc.)
    // We'll swallow the error to keep the app functional without analytics.
    console.warn("Firebase analytics not initialized:", err);
  }
}

const auth = getAuth(app);
const db = getFirestore(app);

export { app, analytics, auth, db };

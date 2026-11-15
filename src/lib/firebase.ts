import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { isSupported, type Analytics } from "firebase/analytics";

// Values come from your Firebase project settings (Project settings > General > Your apps).
// Set them in a local .env file (see .env.example) — never commit real keys.
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

export const firebaseApp = getApps().length ? getApp() : initializeApp(firebaseConfig);
export const db = getFirestore(firebaseApp);
export const auth = getAuth(firebaseApp);

// Analytics only works in the browser and only where the SDK detects
// support (e.g. not when cookies/storage are blocked), so it's loaded
// lazily rather than at module scope.
export let analytics: Analytics | undefined;
if (firebaseConfig.measurementId) {
  isSupported().then((supported) => {
    if (supported) {
      import("firebase/analytics").then(({ getAnalytics }) => {
        analytics = getAnalytics(firebaseApp);
      });
    }
  });
}

import { getApps, initializeApp, type FirebaseApp } from "firebase/app";
import { getAnalytics, isSupported, type Analytics } from "firebase/analytics";

export const firebaseConfig = {
  apiKey: "AIzaSyCm5ab7U2X68nVH1uj8Yzm9sdYOFhjA9WQ",
  authDomain: "minutes-of-meeting-490003.firebaseapp.com",
  projectId: "minutes-of-meeting-490003",
  storageBucket: "minutes-of-meeting-490003.firebasestorage.app",
  messagingSenderId: "206409181885",
  appId: "1:206409181885:web:9c44bcee034842c27b25d4",
  measurementId: "G-RMY0FMTFRJ",
};

export function getFirebaseClientApp(): FirebaseApp {
  const existing = getApps();
  return existing.length > 0 ? existing[0] : initializeApp(firebaseConfig);
}

let analyticsPromise: Promise<Analytics | null> | null = null;

export function getFirebaseAnalytics(): Promise<Analytics | null> {
  if (typeof window === "undefined") {
    return Promise.resolve(null);
  }

  if (!analyticsPromise) {
    analyticsPromise = isSupported()
      .then((supported) => (supported ? getAnalytics(getFirebaseClientApp()) : null))
      .catch(() => null);
  }

  return analyticsPromise;
}

// Firebase configuration + initialization (Modular SDK)
//
// IMPORTANT:
// - For Expo / React Native with the Firebase JS SDK, use the "Web app" config from Firebase Console.
// - Enable Email/Password in Firebase Console → Authentication → Sign-in method.
// - Avoid importing `firebase/analytics` in React Native (it's for web).

import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { initializeAuth, getReactNativePersistence } from "@firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Your Firebase (Web app) configuration
// NOTE: If you plan to push this repo, move these values to env vars and do not commit secrets.
const firebaseConfig = {
  apiKey: "AIzaSyDismPOaTUVWw4cNfg19L0sUg-tbjcjqmU",
  authDomain: "baon-buddy.firebaseapp.com",
  projectId: "baon-buddy",
  storageBucket: "baon-buddy.firebasestorage.app",
  messagingSenderId: "867570735776",
  appId: "1:867570735776:web:2028384a1a6fee7d62c7c5",
  measurementId: "G-1D9NM7L1K4",
};

// Avoid re-initializing Firebase in development (Fast Refresh)
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

// Auth persistence:
// React Native does not have browser localStorage, so we use AsyncStorage.
// This keeps the user logged in even after the app is closed and reopened.
let auth;
try {
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage),
  });
} catch (error) {
  // If Auth is already initialized, fall back to the existing instance.
  auth = getAuth(app);
}

export { auth };

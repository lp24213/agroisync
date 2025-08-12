import { initializeApp, getApps } from 'firebase/app';
import { getAuth, connectAuthEmulator } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';
import { getStorage, connectStorageEmulator } from 'firebase/storage';
import { getAnalytics, isSupported } from 'firebase/analytics';

// Firebase configuration with the provided credentials
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyAKrRqO9U21UJdgMwmwXYH8pNpXaDjJvoc",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "agroisync.com",
  databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL || "https://agroisync-95542-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "agrotmsol-95542",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "agroisync-95542.firebasestorage.app",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "533878061709",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:533878061709:web:c76cf40fe9dff00a0900c4",
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || "G-36EN55X7EY",
};

// Firebase Debug Token for development and debugging
const FIREBASE_DEBUG_TOKEN = process.env.NEXT_PUBLIC_FIREBASE_DEBUG_TOKEN || "AFCAADF3-BDCF-4B29-B1E8-C69180EA55D2";

// Initialize Firebase only if we have valid config
let app = null;
let auth = null;
let db = null;
let storage = null;
let analytics = null;

// Check if we have at least the basic Firebase config
const hasValidConfig = firebaseConfig.apiKey && 
                      firebaseConfig.authDomain && 
                      firebaseConfig.projectId && 
                      firebaseConfig.apiKey !== 'demo_api_key';

if (hasValidConfig) {
  try {
    if (!getApps().length) {
      app = initializeApp(firebaseConfig);
    } else {
      app = getApps()[0];
    }

    // Initialize Firebase services
    auth = getAuth(app);
    db = getFirestore(app);
    storage = getStorage(app);

    // Initialize Analytics (only in browser and if supported)
    if (typeof window !== 'undefined') {
      isSupported().then((supported) => {
        if (supported) {
          analytics = getAnalytics(app);
        }
      });
    }

    // Connect to emulators in development
    if (process.env.NODE_ENV === 'development') {
      // Auth emulator
      if (process.env.NEXT_PUBLIC_USE_FIREBASE_EMULATOR === 'true') {
        try {
          connectAuthEmulator(auth, 'http://localhost:9099');
          connectFirestoreEmulator(db, 'localhost', 8080);
          connectStorageEmulator(storage, 'localhost', 9199);
        } catch (error) {
          console.warn('Firebase emulators already connected or not available');
        }
      }
    }

    // Log Firebase initialization success with debug token
    if (process.env.NODE_ENV === 'development') {
      console.log('🚀 Firebase initialized successfully for AGROISYNC');
      console.log('🔑 Debug Token:', FIREBASE_DEBUG_TOKEN);
      console.log('🌐 Domain:', firebaseConfig.authDomain);
    }
  } catch (error) {
    console.warn('Firebase initialization failed:', error);
  }
} else {
  console.warn('Firebase configuration not found. Using mock services.');
}

export { app, auth, db, storage, analytics, FIREBASE_DEBUG_TOKEN };
export default app;

import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  FacebookAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  type User,
  type UserCredential
} from 'firebase/auth';

const envApiKey = import.meta.env.VITE_FIREBASE_API_KEY;
export const isRealFirebaseConfigured = Boolean(
  envApiKey &&
  envApiKey !== 'AIzaSyDemoKeyForISTQBExamApp12345' &&
  !envApiKey.includes('your_firebase_api_key')
);

const firebaseConfig = {
  apiKey: isRealFirebaseConfigured ? envApiKey : 'AIzaSyDemoKeyForISTQBExamApp12345',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'istqb-exam-simulator.firebaseapp.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'istqb-exam-simulator',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'istqb-exam-simulator.appspot.com',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '123456789012',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '1:123456789012:web:demo123456'
};

// Initialize Firebase App
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
export const auth = getAuth(app);

export const googleProvider = new GoogleAuthProvider();
googleProvider.addScope('profile');
googleProvider.addScope('email');
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

export const facebookProvider = new FacebookAuthProvider();
facebookProvider.addScope('email');
facebookProvider.addScope('public_profile');

export const signInWithGoogleOAuth = async (): Promise<UserCredential | null> => {
  if (!isRealFirebaseConfigured) {
    return null;
  }
  return await signInWithPopup(auth, googleProvider);
};

export const signInWithFacebookOAuth = async (): Promise<UserCredential | null> => {
  if (!isRealFirebaseConfigured) {
    return null;
  }
  return await signInWithPopup(auth, facebookProvider);
};

export const firebaseLogout = async (): Promise<void> => {
  if (isRealFirebaseConfigured) {
    await signOut(auth);
  }
};

export { onAuthStateChanged, type User };

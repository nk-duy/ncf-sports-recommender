import { initializeApp, getApps } from 'firebase/app';
import { getAuth, GoogleAuthProvider, FacebookAuthProvider } from 'firebase/auth';

// Your web app's Firebase configuration
// In a real application, you should use environment variables
// e.g. process.env.NEXT_PUBLIC_FIREBASE_API_KEY
const firebaseConfig = {
  apiKey: "AIzaSy_MOCK_API_KEY_FOR_DEMO",
  authDomain: "mock-kady.firebaseapp.com",
  projectId: "mock-kady",
  storageBucket: "mock-kady.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:mock12345"
};

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

// Initialize Auth
export const auth = getAuth(app);

// Initialize Providers
export const googleProvider = new GoogleAuthProvider();
export const facebookProvider = new FacebookAuthProvider();

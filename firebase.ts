import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyDM1arBhV-c8edIK4rtrAD4-6ETKMe7anM",
  authDomain: "apes-review.firebaseapp.com",
  projectId: "apes-review",
  storageBucket: "apes-review.firebasestorage.app",
  messagingSenderId: "235956447574",
  appId: "1:235956447574:web:25fb21b044a2d7b6b74ef7"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
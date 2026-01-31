// Firebase configuration for OAuth authentication
// To set up:
// 1. Go to https://console.firebase.google.com/
// 2. Create a new project (or use existing)
// 3. Go to Authentication > Sign-in method > Enable Google, GitHub, Microsoft
// 4. Go to Project Settings > Your apps > Add web app
// 5. Copy your config values below

import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  GoogleAuthProvider, 
  GithubAuthProvider, 
  OAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  User
} from 'firebase/auth';

// Firebase configuration - Your AutoDoc project config
const firebaseConfig = {
  apiKey: "AIzaSyBLf-x3JjTDDVrk5cJiUY1gYXbodKx6Wyc",
  authDomain: "autodoc-9d3d4.firebaseapp.com",
  projectId: "autodoc-9d3d4",
  storageBucket: "autodoc-9d3d4.firebasestorage.app",
  messagingSenderId: "6906110118",
  appId: "1:6906110118:web:ad1c65f404ef86a7855467"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// OAuth Providers
const googleProvider = new GoogleAuthProvider();
googleProvider.addScope('email');
googleProvider.addScope('profile');

const githubProvider = new GithubAuthProvider();
githubProvider.addScope('user:email');

const microsoftProvider = new OAuthProvider('microsoft.com');
microsoftProvider.addScope('email');
microsoftProvider.addScope('profile');

// Sign in functions
export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return { success: true, user: result.user };
  } catch (error: any) {
    console.error('Google sign-in error:', error);
    return { success: false, error: error.message };
  }
};

export const signInWithGitHub = async () => {
  try {
    const result = await signInWithPopup(auth, githubProvider);
    return { success: true, user: result.user };
  } catch (error: any) {
    console.error('GitHub sign-in error:', error);
    return { success: false, error: error.message };
  }
};

export const signInWithMicrosoft = async () => {
  try {
    const result = await signInWithPopup(auth, microsoftProvider);
    return { success: true, user: result.user };
  } catch (error: any) {
    console.error('Microsoft sign-in error:', error);
    return { success: false, error: error.message };
  }
};

export const logOut = async () => {
  try {
    await signOut(auth);
    return { success: true };
  } catch (error: any) {
    console.error('Sign-out error:', error);
    return { success: false, error: error.message };
  }
};

// Auth state observer
export const onAuthChange = (callback: (user: User | null) => void) => {
  return onAuthStateChanged(auth, callback);
};

export { auth };
export type { User };

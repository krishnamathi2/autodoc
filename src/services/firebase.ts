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
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendEmailVerification,
  sendPasswordResetEmail,
  updateProfile,
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
    
    // Handle specific Firebase auth errors
    let errorMessage = error.message;
    
    if (error.code === 'auth/account-exists-with-different-credential') {
      errorMessage = 'An account already exists with this email using a different sign-in method. Please sign in with that method first.';
    } else if (error.code === 'auth/popup-blocked') {
      errorMessage = 'Sign-in popup was blocked. Please allow popups for this site.';
    } else if (error.code === 'auth/popup-closed-by-user') {
      errorMessage = 'Sign-in was cancelled.';
    } else if (error.code === 'auth/unauthorized-domain') {
      errorMessage = 'This domain is not authorized for GitHub sign-in. Please add it to Firebase Console.';
    } else if (error.code === 'auth/operation-not-allowed') {
      errorMessage = 'GitHub sign-in is not enabled. Please enable it in Firebase Console.';
    }
    
    return { success: false, error: errorMessage };
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

// Email/Password Authentication
export const createAccountWithEmail = async (email: string, password: string, displayName: string) => {
  try {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    
    // Update the user's display name
    if (result.user) {
      await updateProfile(result.user, { displayName });
      
      // Send verification email
      await sendEmailVerification(result.user);
    }
    
    return { success: true, user: result.user };
  } catch (error: any) {
    console.error('Email signup error:', error);
    let errorMessage = error.message;
    
    // Provide user-friendly error messages
    if (error.code === 'auth/email-already-in-use') {
      errorMessage = 'An account with this email already exists. Please sign in instead.';
    } else if (error.code === 'auth/weak-password') {
      errorMessage = 'Password is too weak. Please use at least 6 characters.';
    } else if (error.code === 'auth/invalid-email') {
      errorMessage = 'Please enter a valid email address.';
    }
    
    return { success: false, error: errorMessage };
  }
};

export const signInWithEmail = async (email: string, password: string) => {
  try {
    const result = await signInWithEmailAndPassword(auth, email, password);
    return { success: true, user: result.user };
  } catch (error: any) {
    console.error('Email sign-in error:', error);
    let errorMessage = error.message;
    
    // Provide user-friendly error messages
    if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
      errorMessage = 'Invalid email or password. Please try again.';
    } else if (error.code === 'auth/too-many-requests') {
      errorMessage = 'Too many failed attempts. Please try again later.';
    } else if (error.code === 'auth/user-disabled') {
      errorMessage = 'This account has been disabled. Please contact support.';
    }
    
    return { success: false, error: errorMessage };
  }
};

export const resetPassword = async (email: string) => {
  try {
    await sendPasswordResetEmail(auth, email);
    return { success: true };
  } catch (error: any) {
    console.error('Password reset error:', error);
    let errorMessage = error.message;
    
    if (error.code === 'auth/user-not-found') {
      errorMessage = 'No account found with this email address.';
    }
    
    return { success: false, error: errorMessage };
  }
};

export const resendVerificationEmail = async () => {
  try {
    const user = auth.currentUser;
    if (user) {
      await sendEmailVerification(user);
      return { success: true };
    }
    return { success: false, error: 'No user is signed in.' };
  } catch (error: any) {
    console.error('Resend verification error:', error);
    return { success: false, error: error.message };
  }
};

export { auth };
export type { User };

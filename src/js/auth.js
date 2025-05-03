// auth.js - Authentication functions

import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js";
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup,
  onAuthStateChanged,
  signOut 
} from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  collection,
  query,
  where,
  getDocs
} from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB_Gx8Reo7Pls-kugk6vCtx58K7F0QnuEU",
  authDomain: "vibez-58fc7.firebaseapp.com",
  projectId: "vibez-58fc7",
  storageBucket: "vibez-58fc7.appspot.com",
  messagingSenderId: "320272207775",
  appId: "1:320272207775:web:1e2240a3f07cbd80abb7aa",
  measurementId: "G-XKWZC5F17V"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Sign in with Google
async function signInWithGoogle() {
  const provider = new GoogleAuthProvider();
  try {
    const result = await signInWithPopup(auth, provider);
    return result;
  } catch (error) {
    console.error("Error during sign in:", error);
    throw error;
  }
}

// Check if current user is an admin
async function checkIfAdmin() {
  const user = auth.currentUser;
  if (!user) return false;
  
  try {
    const userDoc = await getDoc(doc(db, "users", user.uid));
    if (userDoc.exists()) {
      return userDoc.data().isAdmin === true;
    }
    return false;
  } catch (error) {
    console.error("Error checking admin status:", error);
    return false;
  }
}

// Save user details
async function saveUserDetails(mobile, isAdmin = false) {
  const user = auth.currentUser;
  if (!user || !mobile) return false;

  // Check if mobile is unique
  const usersRef = collection(db, "users");
  const q = query(usersRef, where("mobile", "==", mobile));
  const querySnapshot = await getDocs(q);

  if (!querySnapshot.empty) {
    throw new Error("Mobile number already registered");
  }

  // Save user data
  try {
    await setDoc(doc(db, "users", user.uid), {
      name: user.displayName,
      email: user.email,
      mobile: mobile,
      isAdmin: isAdmin,
      createdAt: new Date()
    });
    return true;
  } catch (error) {
    console.error("Error saving user details:", error);
    throw error;
  }
}

// Sign out user
async function signOutUser() {
  try {
    await signOut(auth);
    return true;
  } catch (error) {
    console.error("Error signing out:", error);
    throw error;
  }
}

// Auth state observer
function onAuthStateChange(callback) {
  return onAuthStateChanged(auth, callback);
}

// Redirect based on user role
async function redirectBasedOnRole() {
  const user = auth.currentUser;
  if (!user) {
    window.location.href = "/login.html";
    return;
  }

  const isAdmin = await checkIfAdmin();
  
  // Check if already on the correct page
  const currentPath = window.location.pathname;
  
  if (isAdmin) {
    // If on regular page but is admin, redirect to admin dashboard
    if (!currentPath.includes('/admin/')) {
      window.location.href = "/admin/dashboard.html";
    }
  } else {
    // If on admin page but not admin, redirect to home
    if (currentPath.includes('/admin/')) {
      window.location.href = "/home.html";
    }
  }
}

// Get user profile
async function getUserProfile() {
  const user = auth.currentUser;
  if (!user) return null;
  
  try {
    const userDoc = await getDoc(doc(db, "users", user.uid));
    if (userDoc.exists()) {
      return {
        id: user.uid,
        ...userDoc.data()
      };
    }
    return null;
  } catch (error) {
    console.error("Error getting user profile:", error);
    return null;
  }
}

export {
  auth,
  db,
  signInWithGoogle,
  checkIfAdmin,
  saveUserDetails,
  signOutUser,
  onAuthStateChange,
  redirectBasedOnRole,
  getUserProfile
};
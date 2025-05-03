// auth.js - Authentication functions

// Firebase SDK is now imported via CDN in the HTML

// Get Firebase instances
const auth = firebase.auth();
const db = firebase.firestore();

// Sign in with Google
async function signInWithGoogle() {
  const provider = new firebase.auth.GoogleAuthProvider();
  try {
    const result = await auth.signInWithPopup(provider);
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
    const userDoc = await db.collection("users").doc(user.uid).get();
    if (userDoc.exists) {
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
  const usersRef = db.collection("users");
  const query = usersRef.where("mobile", "==", mobile);
  const querySnapshot = await query.get();

  if (!querySnapshot.empty) {
    throw new Error("Mobile number already registered");
  }

  // Save user data
  try {
    await db.collection("users").doc(user.uid).set({
      name: user.displayName,
      email: user.email,
      mobile: mobile,
      isAdmin: isAdmin,
      createdAt: firebase.firestore.FieldValue.serverTimestamp()
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
    await auth.signOut();
    return true;
  } catch (error) {
    console.error("Error signing out:", error);
    throw error;
  }
}

// Auth state observer
function onAuthStateChange(callback) {
  return auth.onAuthStateChanged(callback);
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
    const userDoc = await db.collection("users").doc(user.uid).get();
    if (userDoc.exists) {
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

// Export functions
window.authFunctions = {
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

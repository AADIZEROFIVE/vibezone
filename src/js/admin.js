// admin.js - Admin functions

// Get Firebase instances from auth.js
const auth = firebase.auth();
const db = firebase.firestore();

// Initialize admin page and verify admin status
async function initAdminPage() {
  try {
    // Ensure user is logged in
    const user = auth.currentUser;
    if (!user) {
      window.location.href = "/login.html";
      return false;
    }
    
    // Check if user is admin
    const userDoc = await db.collection("users").doc(user.uid).get();
    
    if (!userDoc.exists || !userDoc.data().isAdmin) {
      window.location.href = "/home.html";
      return false;
    }
    
    return true;
  } catch (error) {
    console.error("Error initializing admin page:", error);
    window.location.href = "/login.html";
    return false;
  }
}

// Get all users
async function getAllUsers() {
  try {
    const usersRef = db.collection("users");
    const querySnapshot = await usersRef.orderBy("createdAt", "desc").get();
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error("Error getting users:", error);
    throw error;
  }
}

// Toggle admin status
async function toggleAdminStatus(userId, makeAdmin) {
  try {
    const userRef = db.collection("users").doc(userId);
    await userRef.update({
      isAdmin: makeAdmin
    });
    return true;
  } catch (error) {
    console.error("Error updating admin status:", error);
    throw error;
  }
}

// Delete user
async function deleteUser(userId) {
  try {
    await db.collection("users").doc(userId).delete();
    return true;
  } catch (error) {
    console.error("Error deleting user:", error);
    throw error;
  }
}

// Add new workspace
async function addWorkspace(workspaceData) {
  try {
    const workspacesRef = db.collection("workspaces");
    const docRef = await workspacesRef.add({
      ...workspaceData,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      createdBy: auth.currentUser.uid
    });
    return docRef.id;
  } catch (error) {
    console.error("Error adding workspace:", error);
    throw error;
  }
}

// Get all workspaces
async function getWorkspaces() {
  try {
    const workspacesRef = db.collection("workspaces");
    const querySnapshot = await workspacesRef.orderBy("createdAt", "desc").get();
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error("Error getting workspaces:", error);
    throw error;
  }
}

// Update workspace
async function updateWorkspace(workspaceId, workspaceData) {
  try {
    const workspaceRef = db.collection("workspaces").doc(workspaceId);
    await workspaceRef.update({
      ...workspaceData,
      updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
      updatedBy: auth.currentUser.uid
    });
    return true;
  } catch (error) {
    console.error("Error updating workspace:", error);
    throw error;
  }
}

// Delete workspace
async function deleteWorkspace(workspaceId) {
  try {
    await db.collection("workspaces").doc(workspaceId).delete();
    return true;
  } catch (error) {
    console.error("Error deleting workspace:", error);
    throw error;
  }
}

// Add chill zone
async function addChillZone(zoneData) {
  try {
    const zonesRef = db.collection("chillZones");
    const docRef = await zonesRef.add({
      ...zoneData,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      createdBy: auth.currentUser.uid
    });
    return docRef.id;
  } catch (error) {
    console.error("Error adding chill zone:", error);
    throw error;
  }
}

// Get all chill zones
async function getChillZones() {
  try {
    const zonesRef = db.collection("chillZones");
    const querySnapshot = await zonesRef.orderBy("createdAt", "desc").get();
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error("Error getting chill zones:", error);
    throw error;
  }
}

// Update chill zone
async function updateChillZone(zoneId, zoneData) {
  try {
    const zoneRef = db.collection("chillZones").doc(zoneId);
    await zoneRef.update({
      ...zoneData,
      updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
      updatedBy: auth.currentUser.uid
    });
    return true;
  } catch (error) {
    console.error("Error updating chill zone:", error);
    throw error;
  }
}

// Delete chill zone
async function deleteChillZone(zoneId) {
  try {
    await db.collection("chillZones").doc(zoneId).delete();
    return true;
  } catch (error) {
    console.error("Error deleting chill zone:", error);
    throw error;
  }
}

// Add event
async function addEvent(eventData) {
  try {
    const eventsRef = db.collection("events");
    const docRef = await eventsRef.add({
      ...eventData,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      createdBy: auth.currentUser.uid
    });
    return docRef.id;
  } catch (error) {
    console.error("Error adding event:", error);
    throw error;
  }
}

// Get all events
async function getEvents() {
  try {
    const eventsRef = db.collection("events");
    const querySnapshot = await eventsRef.orderBy("date", "asc").get();
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error("Error getting events:", error);
    throw error;
  }
}

// Update event
async function updateEvent(eventId, eventData) {
  try {
    const eventRef = db.collection("events").doc(eventId);
    await eventRef.update({
      ...eventData,
      updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
      updatedBy: auth.currentUser.uid
    });
    return true;
  } catch (error) {
    console.error("Error updating event:", error);
    throw error;
  }
}

// Delete event
async function deleteEvent(eventId) {
  try {
    await db.collection("events").doc(eventId).delete();
    return true;
  } catch (error) {
    console.error("Error deleting event:", error);
    throw error;
  }
}

// Get dashboard stats
async function getDashboardStats() {
  try {
    const usersCollection = db.collection("users");
    const workspacesCollection = db.collection("workspaces");
    const chillZonesCollection = db.collection("chillZones");
    const eventsCollection = db.collection("events");
    
    const [users, workspaces, chillZones, events] = await Promise.all([
      usersCollection.get(),
      workspacesCollection.get(),
      chillZonesCollection.get(),
      eventsCollection.get()
    ]);
    
    return {
      totalUsers: users.size,
      totalWorkspaces: workspaces.size,
      totalChillZones: chillZones.size,
      totalEvents: events.size
    };
  } catch (error) {
    console.error("Error getting dashboard stats:", error);
    throw error;
  }
}

// Export functions
window.adminFunctions = {
  initAdminPage,
  getAllUsers,
  toggleAdminStatus,
  deleteUser,
  addWorkspace,
  getWorkspaces,
  updateWorkspace,
  deleteWorkspace,
  addChillZone,
  getChillZones,
  updateChillZone,
  deleteChillZone,
  addEvent,
  getEvents,
  updateEvent,
  deleteEvent,
  getDashboardStats
};

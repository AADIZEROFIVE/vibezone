// admin.js - Admin functions

import { 
    db, 
    auth,
    checkIfAdmin 
  } from './auth.js';
  
  import {
    collection,
    query,
    getDocs,
    doc,
    getDoc,
    updateDoc,
    deleteDoc,
    addDoc,
    where,
    orderBy,
    limit,
    Timestamp
  } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";
  
  // Initialize admin page and verify admin status
  async function initAdminPage() {
    const isAdmin = await checkIfAdmin();
    if (!isAdmin) {
      window.location.href = "/home.html";
      return false;
    }
    return true;
  }
  
  // Get all users
  async function getAllUsers() {
    try {
      const usersRef = collection(db, "users");
      const q = query(usersRef, orderBy("createdAt", "desc"));
      const querySnapshot = await getDocs(q);
      
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
      const userRef = doc(db, "users", userId);
      await updateDoc(userRef, {
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
      await deleteDoc(doc(db, "users", userId));
      return true;
    } catch (error) {
      console.error("Error deleting user:", error);
      throw error;
    }
  }
  
  // Add new workspace
  async function addWorkspace(workspaceData) {
    try {
      const workspacesRef = collection(db, "workspaces");
      const docRef = await addDoc(workspacesRef, {
        ...workspaceData,
        createdAt: Timestamp.now(),
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
      const workspacesRef = collection(db, "workspaces");
      const q = query(workspacesRef, orderBy("createdAt", "desc"));
      const querySnapshot = await getDocs(q);
      
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
      const workspaceRef = doc(db, "workspaces", workspaceId);
      await updateDoc(workspaceRef, {
        ...workspaceData,
        updatedAt: Timestamp.now(),
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
      await deleteDoc(doc(db, "workspaces", workspaceId));
      return true;
    } catch (error) {
      console.error("Error deleting workspace:", error);
      throw error;
    }
  }
  
  // Add chill zone
  async function addChillZone(zoneData) {
    try {
      const zonesRef = collection(db, "chillZones");
      const docRef = await addDoc(zonesRef, {
        ...zoneData,
        createdAt: Timestamp.now(),
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
      const zonesRef = collection(db, "chillZones");
      const q = query(zonesRef, orderBy("createdAt", "desc"));
      const querySnapshot = await getDocs(q);
      
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
      const zoneRef = doc(db, "chillZones", zoneId);
      await updateDoc(zoneRef, {
        ...zoneData,
        updatedAt: Timestamp.now(),
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
      await deleteDoc(doc(db, "chillZones", zoneId));
      return true;
    } catch (error) {
      console.error("Error deleting chill zone:", error);
      throw error;
    }
  }
  
  // Add event
  async function addEvent(eventData) {
    try {
      const eventsRef = collection(db, "events");
      const docRef = await addDoc(eventsRef, {
        ...eventData,
        createdAt: Timestamp.now(),
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
      const eventsRef = collection(db, "events");
      const q = query(eventsRef, orderBy("date", "asc"));
      const querySnapshot = await getDocs(q);
      
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
      const eventRef = doc(db, "events", eventId);
      await updateDoc(eventRef, {
        ...eventData,
        updatedAt: Timestamp.now(),
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
      await deleteDoc(doc(db, "events", eventId));
      return true;
    } catch (error) {
      console.error("Error deleting event:", error);
      throw error;
    }
  }
  
  // Get dashboard stats
  async function getDashboardStats() {
    try {
      const usersCollection = collection(db, "users");
      const workspacesCollection = collection(db, "workspaces");
      const chillZonesCollection = collection(db, "chillZones");
      const eventsCollection = collection(db, "events");
      
      const [users, workspaces, chillZones, events] = await Promise.all([
        getDocs(usersCollection),
        getDocs(workspacesCollection),
        getDocs(chillZonesCollection),
        getDocs(eventsCollection)
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
  
  export {
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
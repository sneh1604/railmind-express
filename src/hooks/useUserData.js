// src/hooks/useUserData.js

import { useState, useEffect } from 'react';
import { doc, onSnapshot, updateDoc } from 'firebase/firestore';
import { db } from '../services/firestore.js';

/**
 * Fetches and listens to a user's profile data in real-time.
 * @param {string} userId - The ID of the user to fetch data for.
 * @returns {object} An object with userData, loading state, and an update function.
 */
export const useUserData = (userId) => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    const userDocRef = doc(db, 'users', userId);
    
    // Set up a real-time listener
    const unsubscribe = onSnapshot(userDocRef, (doc) => {
      if (doc.exists()) {
        setUserData({ id: doc.id, ...doc.data() });
      } else {
        setUserData(null); // Handle case where user document doesn't exist
      }
      setLoading(false);
    }, (error) => {
      console.error("Error fetching user data:", error);
      setLoading(false);
    });

    // Cleanup listener on unmount
    return () => unsubscribe();
  }, [userId]);

  /**
   * Updates the user's document in Firestore.
   * @param {object} dataToUpdate - An object containing the fields to update.
   */
  const updateUserData = async (dataToUpdate) => {
    if (!userId) return;
    const userDocRef = doc(db, 'users', userId);
    try {
      await updateDoc(userDocRef, dataToUpdate);
    } catch (error) {
      console.error("Error updating user data:", error);
      throw error;
    }
  };

  return { userData, loading, updateUserData };
};
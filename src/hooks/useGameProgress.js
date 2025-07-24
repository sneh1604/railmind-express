// src/hooks/useGameProgress.js

import { useState, useEffect } from 'react';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';
import { db } from '../services/firestore.js';

/**
 * Manages a user's game progress data in real-time.
 * @param {string} userId - The ID of the user whose progress to manage.
 * @returns {object} An object with gameProgress, loading state, and an update function.
 */
export const useGameProgress = (userId) => {
  const [gameProgress, setGameProgress] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    const progressDocRef = doc(db, 'gameProgress', userId);

    const unsubscribe = onSnapshot(progressDocRef, (doc) => {
      if (doc.exists()) {
        setGameProgress({ id: doc.id, ...doc.data() });
      } else {
        // Optionally create a default progress document if none exists
        const defaultProgress = {
          levelProgress: {},
          currentJourney: null,
          stationsCompleted: [],
        };
        setGameProgress(defaultProgress);
      }
      setLoading(false);
    }, (error) => {
      console.error("Error fetching game progress:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [userId]);

  /**
   * Updates the user's game progress document in Firestore.
   * Merges data to avoid overwriting the whole document.
   * @param {object} progressData - An object containing the fields to update.
   */
  const updateGameProgress = async (progressData) => {
    if (!userId) return;
    const progressDocRef = doc(db, 'gameProgress', userId);
    try {
      // Use setDoc with merge: true to create or update the document
      await setDoc(progressDocRef, progressData, { merge: true });
    } catch (error) {
      console.error("Error updating game progress:", error);
      throw error;
    }
  };

  return { gameProgress, loading, updateGameProgress };
};
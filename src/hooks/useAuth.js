// src/hooks/useAuth.js

import { useState, useEffect } from 'react';
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  signInAnonymously,
} from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth } from '../services/auth.js';
import { db } from '../services/firestore.js';

/**
 * Custom hook for Firebase authentication.
 * Manages user state, loading, and provides auth functions.
 * @returns {object} An object containing the user, loading state, and auth functions.
 */
export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Listen for authentication state changes
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  /**
   * Creates a new user profile in the 'users' collection.
   * @param {object} userCredential - The user object from Firebase Auth.
   * @param {string} [displayName='New Player'] - The display name for the new user.
   */
  const createUserProfile = async (userCredential, displayName = 'New Player') => {
    if (!userCredential?.user) return;
    const userRef = doc(db, 'users', userCredential.user.uid);
    await setDoc(userRef, {
      userId: userCredential.user.uid,
      displayName,
      email: userCredential.user.email,
      unlockedLevels: [1], // Start with level 1 unlocked
      badges: [],
      totalScore: 0,
      currentLevel: 1,
      questionsAnswered: 0,
      correctAnswers: 0,
      createdAt: serverTimestamp(),
      lastPlayed: serverTimestamp(),
    });
  };

  const signup = async (email, password, displayName) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await createUserProfile(userCredential, displayName);
      return userCredential;
    } catch (error) {
      console.error("Error signing up:", error);
      throw error;
    }
  };

  const login = async (email, password) => {
    try {
      return await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      console.error("Error logging in:", error);
      throw error;
    }
  };
  
  const loginAsGuest = async () => {
    try {
      const userCredential = await signInAnonymously(auth);
      // Create a profile for the anonymous user as well
      await createUserProfile(userCredential, 'Guest Player');
      return userCredential;
    } catch (error) {
      console.error("Error signing in as guest:", error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Error logging out:", error);
      throw error;
    }
  };

  return { user, loading, signup, login, loginAsGuest, logout };
};
// src/contexts/UserContext.js

import React, { createContext, useContext } from 'react';
import { AuthContext, useAuthContext } from './AuthContext.js';
import { useUserData } from '../hooks/useUserData.js';
import { useGameProgress } from '../hooks/useGameProgress.js';

const UserContext = createContext(null);

/**
 * Provides data specific to the logged-in user, like their profile and progress.
 * This component must be a child of AuthProvider.
 * @param {object} props
 * @param {React.ReactNode} props.children - The child components to render.
 */
export const UserProvider = ({ children }) => {
  const { user } = useAuthContext(); // Get the current user from AuthContext

  // Fetch this user's specific data using our custom hooks
  const { userData, loading: userLoading, updateUserData } = useUserData(user?.uid);
  const {
    gameProgress,
    loading: progressLoading,
    updateGameProgress,
  } = useGameProgress(user?.uid);

  const value = {
    userData,
    userLoading,
    updateUserData,
    gameProgress,
    progressLoading,
    updateGameProgress,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

/**
 * A custom hook to easily access the UserContext.
 * @returns {object} The user data object from the context.
 */
export const useUserContext = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUserContext must be used within a UserProvider');
  }
  return context;
};
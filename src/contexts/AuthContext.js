// src/contexts/AuthContext.js

import React, { createContext, useContext } from 'react';
import { useAuth } from '../hooks/useAuth.js'; // The hook we created earlier

// 1. Create the context
const AuthContext = createContext(null);

/**
 * The AuthProvider component that makes auth data available to any child component.
 * @param {object} props
 * @param {React.ReactNode} props.children - The child components to render.
 */
export const AuthProvider = ({ children }) => {
  // 2. Use the hook to get auth state and functions
  const auth = useAuth();

  // 3. Provide the auth object to the rest of the app
  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
};

/**
 * A custom hook to easily access the AuthContext.
 * @returns {object} The authentication object from the context.
 */
export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
};
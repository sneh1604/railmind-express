// src/pages/AuthPage.jsx

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageLayout from '../components/layout/PageLayout.jsx';
import Button from '../components/common/Button.jsx';
import { useAuthContext } from '../contexts/AuthContext.js';
import { motion, AnimatePresence } from 'framer-motion';

const AuthForm = ({ isLogin, onSubmit, error }) => (
  <motion.form 
    className="auth-form" 
    onSubmit={onSubmit}
    key={isLogin ? 'login' : 'signup'}
    initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: 50 }} transition={{ duration: 0.3 }}
  >
    {!isLogin && <input name="displayName" type="text" placeholder="Your Name" required />}
    <input name="email" type="email" placeholder="Email Address" required />
    <input name="password" type="password" placeholder="Password" required />
    {error && <p className="auth-error">{error}</p>}
    <Button type="submit">{isLogin ? 'Log In' : 'Create Account'}</Button>
  </motion.form>
);

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const navigate = useNavigate();
  const { signup, login, loginAsGuest } = useAuthContext();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const { displayName, email, password } = e.target.elements;

    try {
      if (isLogin) {
        await login(email.value, password.value);
      } else {
        await signup(email.value, password.value, displayName.value);
      }
      navigate('/levels'); // Navigate after successful login/signup
    } catch (err) {
      setError(err.message.replace('Firebase: ', '').replace(/\(auth.*\)\.?/, ''));
    }
  };

  const handleGuestLogin = async () => {
    setIsLoading(true);
    setError('');
    try {
      await loginAsGuest();
      navigate('/levels');
    } catch (err) {
      setError("Could not log in as a guest. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <PageLayout>
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-toggle">
            <button onClick={() => setIsLogin(true)} className={isLogin ? 'active' : ''}>Login</button>
            <button onClick={() => setIsLogin(false)} className={!isLogin ? 'active' : ''}>Sign Up</button>
          </div>
          <AnimatePresence mode="wait">
            <AuthForm isLogin={isLogin} onSubmit={handleSubmit} error={error} />
          </AnimatePresence>
          <div className="auth-divider"><span>or</span></div>
          <Button variant="secondary" onClick={handleGuestLogin} disabled={isLoading}>
            {isLoading ? 'Please wait...' : 'Play as a Guest'}
          </Button>
        </div>
      </div>
    </PageLayout>
  );
};

export default AuthPage;
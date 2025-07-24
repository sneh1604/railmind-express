// src/pages/HomePage.jsx

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import PageLayout from '../components/layout/PageLayout.jsx';
import Button from '../components/common/Button.jsx';
import { useAuthContext } from '../contexts/AuthContext.js';

// A simple cartoon train SVG (can be moved to its own component)
const CartoonTrain = () => (
  <motion.svg
    width="200" height="120" viewBox="0 0 200 120"
    initial={{ x: -250 }} animate={{ x: 0 }}
    transition={{ type: 'spring', stiffness: 50, delay: 0.5 }}
  >
    <rect x="20" y="40" width="120" height="60" rx="10" fill="#E74C3C" />
    <rect x="10" y="60" width="20" height="20" rx="5" fill="#3498DB" />
    <rect x="140" y="50" width="40" height="40" rx="5" fill="#F1C40F" />
    <circle cx="45" cy="105" r="15" fill="#2C3E50" />
    <circle cx="115" cy="105" r="15" fill="#2C3E50" />
    <motion.g animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}>
      <rect x="60" y="10" width="15" height="30" fill="#95A5A6" />
      <circle cx="67.5" cy="10" r="10" fill="#ECF0F1" />
    </motion.g>
  </motion.svg>
);

const HomePage = () => {
  const navigate = useNavigate();
  const { loginAsGuest } = useAuthContext();
  const [isLoading, setIsLoading] = useState(false);

  const handlePlayAsGuest = async () => {
    setIsLoading(true);
    try {
      await loginAsGuest();
      // On successful guest login, go straight to the levels
      navigate('/levels');
    } catch (error) {
      console.error("Guest login failed:", error);
      setIsLoading(false);
    }
  };

  return (
    <PageLayout>
      <div className="home-container">
        <motion.div
          className="hero-content"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="hero-title">Welcome to RailMind Express!</h1>
          <p className="hero-subtitle">
            All aboard for a brain-boosting adventure across India! Solve fun puzzles, unlock new cities, and become a trivia master.
          </p>
          <div className="home-actions">
            <Button onClick={handlePlayAsGuest} disabled={isLoading}>
              {isLoading ? 'Boarding...' : '▶️ Play Now!'}
            </Button>
            <Link to="/auth" className="auth-link">
              or Log In / Sign Up
            </Link>
          </div>
        </motion.div>
        <div className="hero-image">
          <CartoonTrain />
        </div>
      </div>
    </PageLayout>
  );
};

export default HomePage;
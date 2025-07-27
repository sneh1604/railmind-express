// src/pages/HomePage.jsx

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import PageLayout from '../components/layout/PageLayout.jsx';
import Button from '../components/common/Button.jsx';
import { useAuthContext } from '../contexts/AuthContext.js';
import { FaMapMarkedAlt, FaQuestionCircle, FaTrophy } from 'react-icons/fa';

// --- Local Animated Components to tell the story ---

// Scene 1: The Train Journey
const AnimatedJourney = () => (
  <div className="story-scene">
    <FaMapMarkedAlt className="scene-icon" />
    <h2 className="scene-title">Explore India!</h2>
    <p className="scene-description">Travel on virtual trains to famous cities across the country.</p>
    <svg width="250" height="150" viewBox="0 0 250 150">
      <defs>
        <path id="motion-path" d="M20,100 Q125,20 230,100" />
      </defs>
      <path d="M20,100 Q125,20 230,100" stroke="#7f8c8d" strokeDasharray="5,5" strokeWidth="3" fill="none" />
      <g>
        <circle r="10" fill="#E74C3C">
          <animateMotion dur="3s" repeatCount="indefinite">
            <mpath href="#motion-path" />
          </animateMotion>
        </circle>
        <text x="-4" y="4" fontSize="12" fill="white">
          <animateMotion dur="3s" repeatCount="indefinite">
            <mpath href="#motion-path" />
          </animateMotion>
          🚂
        </text>
      </g>
      <circle cx="20" cy="100" r="8" fill="#3498DB" />
      <circle cx="230" cy="100" r="8" fill="#3498DB" />
    </svg>
  </div>
);

// Scene 2: Solving Puzzles
const AnimatedPuzzle = () => (
  <div className="story-scene">
    <FaQuestionCircle className="scene-icon" />
    <h2 className="scene-title">Solve Puzzles!</h2>
    <p className="scene-description">Answer fun questions at each station to power your train.</p>
    <motion.div className="puzzle-card" initial={{ scale: 0.8 }} animate={{ scale: 1 }}>
      <p>What is 5 x 8?</p>
      <div className="puzzle-options">
        <span>35</span>
        <motion.span className="correct" whileHover={{ scale: 1.1 }}>40</motion.span>
        <span>45</span>
      </div>
    </motion.div>
  </div>
);

// Scene 3: Earning Rewards
const AnimatedReward = () => (
  <div className="story-scene">
    <FaTrophy className="scene-icon" />
    <h2 className="scene-title">Earn Badges!</h2>
    <p className="scene-description">Collect cool badges and trophies for your achievements.</p>
    <motion.div
      className="reward-badge"
      initial={{ scale: 0, rotate: -180 }}
      animate={{ scale: 1, rotate: 0 }}
      transition={{ type: 'spring', stiffness: 100 }}
    >
      <span className="reward-icon">🏆</span>
      <span className="reward-text">Rail Master</span>
    </motion.div>
  </div>
);

const scenes = [
  <AnimatedJourney key="journey" />,
  <AnimatedPuzzle key="puzzle" />,
  <AnimatedReward key="reward" />,
];

const HomePage = () => {
  const navigate = useNavigate();
  const { loginAsGuest } = useAuthContext();
  const [isLoading, setIsLoading] = useState(false);
  const [sceneIndex, setSceneIndex] = useState(0);

  // This effect cycles through the animated scenes
  useEffect(() => {
    const interval = setInterval(() => {
      setSceneIndex(prevIndex => (prevIndex + 1) % scenes.length);
    }, 4000); // Change scene every 4 seconds
    return () => clearInterval(interval);
  }, []);
  
  const handlePlayAsGuest = async () => {
    setIsLoading(true);
    try {
      await loginAsGuest();
      navigate('/levels');
    } catch (error) {
      console.error("Guest login failed:", error);
      setIsLoading(false);
    }
  };

  return (
    <PageLayout>
      <div className="home-container-creative">
        <div className="storyboard-panel">
          <AnimatePresence mode="wait">
            <motion.div
              key={sceneIndex}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.5 }}
            >
              {scenes[sceneIndex]}
            </motion.div>
          </AnimatePresence>
        </div>
        <motion.div
          className="hero-content"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
        >
          <h1 className="hero-title">A Brain-Boosting Adventure Awaits!</h1>
          <p className="hero-subtitle">
            Are you ready to become a RailMind Master?
          </p>
          <div className="home-actions">
            <Button onClick={handlePlayAsGuest} disabled={isLoading}>
              {isLoading ? 'Boarding...' : '▶️ Start Your Journey!'}
            </Button>
            <Link to="/auth" className="auth-link">
              or Log In / Sign Up
            </Link>
          </div>
        </motion.div>
      </div>
    </PageLayout>
  );
};

export default HomePage;
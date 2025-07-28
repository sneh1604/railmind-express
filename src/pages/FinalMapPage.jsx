// src/pages/FinalMapPage.jsx

import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import PageLayout from '../components/layout/PageLayout.jsx';
import GoogleMapView from '../components/map/GoogleMapView.jsx';
import Confetti from '../components/common/Confetti.jsx';
import { useGameContext } from '../contexts/GameContext.js';
import { routes } from '../data/routes.js';
import { levels } from '../data/levels.js';
import { motion } from 'framer-motion';
import { FaTrophy, FaStar, FaRocket, FaPlay, FaHome, FaTrain, FaMapMarkedAlt, FaMedal } from 'react-icons/fa';

// Kid-Friendly Journey Completion Component
const JourneyCompletion = ({ completedLevel, score, isLastLevel }) => {
  const [showCelebration, setShowCelebration] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    // Simple stepped reveal animation
    const stepTimers = [
      setTimeout(() => setCurrentStep(1), 500),
      setTimeout(() => setCurrentStep(2), 1000),
      setTimeout(() => setCurrentStep(3), 1500),
      setTimeout(() => setShowCelebration(true), 2000)
    ];

    return () => stepTimers.forEach(timer => clearTimeout(timer));
  }, []);

  return (
    <motion.div 
      className="journey-completion-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="completion-card">
        {/* Header with Trophy */}
        <motion.div 
          className="completion-header"
          initial={{ scale: 0 }}
          animate={{ scale: currentStep >= 1 ? 1 : 0 }}
          transition={{ type: "spring", duration: 0.6 }}
        >
          <div className="trophy-container">
            <FaTrophy className="trophy-icon" />
            <div className="trophy-sparkles">
              {Array.from({ length: 6 }, (_, i) => (
                <div key={i} className={`sparkle sparkle-${i + 1}`}>✨</div>
              ))}
            </div>
          </div>
          <h1 className="completion-title">Journey Complete!</h1>
          <p className="journey-name">{completedLevel.journeyName}</p>
        </motion.div>

        {/* Achievement Stats */}
        <motion.div 
          className="achievement-section"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: currentStep >= 2 ? 0 : 50, opacity: currentStep >= 2 ? 1 : 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="section-title">Your Amazing Achievement!</h2>
          <div className="stats-grid">
            <div className="stat-card score">
              <FaStar className="stat-icon" />
              <div className="stat-info">
                <span className="stat-number">{score}</span>
                <span className="stat-label">Points Earned</span>
              </div>
            </div>
            
            <div className="stat-card level">
              <FaRocket className="stat-icon" />
              <div className="stat-info">
                <span className="stat-number">{completedLevel.levelNumber}</span>
                <span className="stat-label">Level Completed</span>
              </div>
            </div>
            
            <div className="stat-card journey">
              <FaMedal className="stat-icon" />
              <div className="stat-info">
                <span className="stat-number">100%</span>
                <span className="stat-label">Journey Progress</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div 
          className="action-buttons"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: currentStep >= 3 ? 0 : 50, opacity: currentStep >= 3 ? 1 : 0 }}
          transition={{ duration: 0.5 }}
        >
          <Link to="/levels" className="action-btn secondary">
            <FaHome className="btn-icon" />
            <span>All Routes</span>
          </Link>
          
          <Link 
            to={isLastLevel ? "/" : `/game/${completedLevel.levelNumber + 1}`}
            className="action-btn primary"
          >
            <FaPlay className="btn-icon" />
            <span>{isLastLevel ? 'Finish Grand Tour!' : 'Next Adventure!'}</span>
          </Link>
        </motion.div>

        {/* Fun Decorative Elements */}
        {showCelebration && (
          <div className="celebration-elements">
            {Array.from({ length: 8 }, (_, i) => (
              <div key={i} className={`floating-element element-${i + 1}`}>
                {['🚂', '🎉', '⭐', '🏆', '🎯', '🌟', '🎊', '🚆'][i]}
              </div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
};

const FinalMapPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { score } = useGameContext();
  
  // Simple state management for kid-friendly interface
  const [showCompletion, setShowCompletion] = useState(false);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [trainJourneyComplete, setTrainJourneyComplete] = useState(false);

  const completedLevel = location.state?.completedLevel;

  // Handle train journey completion
  const handleTrainJourneyComplete = () => {
    setTrainJourneyComplete(true);
    // Show completion popup 2 seconds after train reaches destination
    setTimeout(() => setShowCompletion(true), 2000);
  };

  useEffect(() => {
    if (completedLevel) {
      // Show map immediately
      setTimeout(() => setMapLoaded(true), 500);
    }
  }, [completedLevel]);
  
  // If the user navigates here directly, redirect them.
  const [redirected, setRedirected] = useState(false);

  useEffect(() => {
    if (!completedLevel && !redirected) {
      setRedirected(true);
      navigate('/levels');
    }
  }, [completedLevel, navigate, redirected]);

  if (!completedLevel) {
    return null;
  }

  const routeData = routes[completedLevel.levelNumber];
  const isLastLevel = completedLevel.levelNumber === levels.length;

  return (
    <PageLayout>
      <div className="final-map-page">
        {/* Train Journey Header */}
        <motion.div 
          className="journey-header"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="header-content">
            <FaTrain className="train-icon" />
            <div className="header-text">
              <h1>Your Railway Journey</h1>
              <p>Congratulations on completing <strong>{completedLevel.journeyName}</strong>!</p>
            </div>
            <FaMapMarkedAlt className="map-icon" />
          </div>
        </motion.div>

        {/* Map Container */}
        <motion.div 
          className="map-container"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: mapLoaded ? 1 : 0, scale: mapLoaded ? 1 : 0.9 }}
          transition={{ duration: 0.8 }}
        >
          <div className="map-frame">
            <div className="map-border">
              <GoogleMapView 
                route={routeData} 
                onTrainJourneyComplete={handleTrainJourneyComplete}
              />
              
              {/* Train Journey Complete Indicator */}
              {trainJourneyComplete && !showCompletion && (
                <motion.div 
                  className="journey-complete-indicator"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.5 }}
                >
                  <FaTrain className="indicator-icon" />
                  <span>Journey Complete!</span>
                </motion.div>
              )}
            </div>
            
            {/* Map Info Panel */}
            <div className="map-info-panel">
              <div className="route-details">
                <h3>Route Information</h3>
                <div className="route-stats">
                  <div className="stat">
                    <span className="stat-label">From:</span>
                    <span className="stat-value">{routeData?.stations?.[0]?.name || 'Start Station'}</span>
                  </div>
                  <div className="stat">
                    <span className="stat-label">To:</span>
                    <span className="stat-value">{routeData?.stations?.[routeData.stations.length - 1]?.name || 'End Station'}</span>
                  </div>
                  <div className="stat">
                    <span className="stat-label">Stations:</span>
                    <span className="stat-value">{routeData?.stations?.length || 0}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Journey Completion Overlay */}
        {showCompletion && (
          <JourneyCompletion 
            completedLevel={completedLevel}
            score={score}
            isLastLevel={isLastLevel}
          />
        )}

        {/* Celebration Confetti */}
        {showCompletion && <Confetti />}
      </div>
    </PageLayout>
  );
};

export default FinalMapPage;
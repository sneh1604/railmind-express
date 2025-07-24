// src/pages/FinalMapPage.jsx

import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import PageLayout from '../components/layout/PageLayout.jsx';
import GoogleMapView from '../components/map/GoogleMapView.jsx';
import Button from '../components/common/Button.jsx';
import Confetti from '../components/common/Confetti.jsx';
import { useGameContext } from '../contexts/GameContext.js';
import { routes } from '../data/routes.js';
import { levels } from '../data/levels.js'; // Import levels to check for the last one
import { motion, AnimatePresence } from 'framer-motion';

// A new component for the "Arrival Ticket" notification
const ArrivalTicket = ({ journeyName }) => (
  <motion.div
    className="arrival-ticket"
    initial={{ y: -200, opacity: 0 }}
    animate={{ y: 0, opacity: 1 }}
    exit={{ y: -200, opacity: 0 }}
    transition={{ type: 'spring', stiffness: 100 }}
  >
    <div className="ticket-top">🎫 Arrival</div>
    <div className="ticket-body">
      <h3>Journey Complete!</h3>
      <p>{journeyName}</p>
    </div>
  </motion.div>
);

const FinalMapPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { score } = useGameContext();
  
  // State to manage the celebration sequence: 'arriving' -> 'ticket' -> 'summary'
  const [stage, setStage] = useState('arriving');

  const completedLevel = location.state?.completedLevel;

  useEffect(() => {
    if (completedLevel) {
      // After 3 seconds (letting the map animation finish), show the arrival ticket.
      const timer1 = setTimeout(() => setStage('ticket'), 3000);
      // After 5 seconds, show the final summary.
      const timer2 = setTimeout(() => setStage('summary'), 5000);
      return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
      };
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
      <div className="final-map-container">
        <GoogleMapView route={routeData} />

        <AnimatePresence>
          {stage === 'ticket' && (
            <ArrivalTicket journeyName={completedLevel.journeyName} />
          )}

          {stage === 'summary' && (
            <motion.div
              className="completion-overlay-new"
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 100 }}
            >
              <Confetti />
              <div className="completion-icon animate-tada">🏆</div>
              <h1 className="completion-title">{completedLevel.journeyName} Complete!</h1>
              <p className="completion-text">
                You earned <strong>{score}</strong> points on this journey!
              </p>
              <div className="completion-actions">
                <Link to="/levels">
                  <Button variant="secondary">All Routes</Button>
                </Link>
                <Link to={isLastLevel ? "/" : `/game/${completedLevel.levelNumber + 1}`}>
                  <Button>{isLastLevel ? 'Finish Grand Tour!' : 'Next Journey!'}</Button>
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </PageLayout>
  );
};

export default FinalMapPage;
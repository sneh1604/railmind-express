// src/pages/LevelSelectPage.jsx

import React from 'react';
import { useNavigate } from 'react-router-dom';
import PageLayout from '../components/layout/PageLayout.jsx';
import GameCard from '../components/common/GameCard.jsx';
import LoadingSpinner from '../components/common/LoadingSpinner.jsx';
import { useUserContext } from '../contexts/UserContext.js';
import { levels } from '../data/levels.js';
import { motion } from 'framer-motion';

const LevelSelectPage = () => {
  const navigate = useNavigate();
  const { userData, userLoading } = useUserContext();

  if (userLoading) {
    return <div className="loading-container"> <LoadingSpinner /> </div>;
  }

  const unlockedLevels = userData?.unlockedLevels || [1];

  const handleLevelSelect = (level) => {
    if (unlockedLevels.includes(level.levelNumber)) {
      navigate(`/game/${level.levelNumber}`);
    } else {
      const card = document.getElementById(`level-card-${level.levelNumber}`);
      card.classList.add('animate-shake');
      setTimeout(() => card.classList.remove('animate-shake'), 800);
    }
  };

  return (
    <PageLayout>
      <div className="level-select-container">
        <h1 className="page-title">Choose Your Adventure!</h1>
        <p className="page-subtitle">Pick a route and get ready to test your knowledge.</p>
        <div className="level-grid">
          {levels.map((level, index) => {
            const isLocked = !unlockedLevels.includes(level.levelNumber);
            return (
              <motion.div
                id={`level-card-${level.levelNumber}`}
                key={level.levelNumber}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className={isLocked ? 'locked' : ''}
              >
                <GameCard 
                  title={`Level ${level.levelNumber}: ${level.journeyName}`}
                  description={`${level.startCity} ➔ ${level.endCity}`}
                  // This is the only line that changed!
                  imageUrl={level.imageUrl}
                  badgeText={isLocked ? '🔒 Locked' : '▶️ Play'}
                  onClick={() => handleLevelSelect(level)}
                />
              </motion.div>
            );
          })}
        </div>
      </div>
    </PageLayout>
  );
};

export default LevelSelectPage;
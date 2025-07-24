// src/pages/ProfilePage.jsx

import React from 'react';
import PageLayout from '../components/layout/PageLayout.jsx';
import LoadingSpinner from '../components/common/LoadingSpinner.jsx';
import { useUserContext } from '../contexts/UserContext.js';
import { FaStar, FaCheckCircle, FaTrophy, FaUserEdit } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { getAccuracy } from '../utils/gameLogic.js';
import { badges as allBadgesData } from '../data/badges.js'; // Import all possible badges

// A new, more creative component for displaying a single badge
const BadgeCard = ({ badgeInfo }) => {
  if (!badgeInfo) return null;
  return (
    <motion.div
      className="badge-card"
      title={badgeInfo.description} // This creates a simple tooltip on hover
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.1, zIndex: 2 }}
    >
      <div className="badge-icon">{badgeInfo.icon}</div>
      <div className="badge-name">{badgeInfo.name}</div>
    </motion.div>
  );
};

const ProfilePage = () => {
  const { userData, userLoading } = useUserContext();

  if (userLoading) {
    return <div className="loading-container"> <LoadingSpinner /> </div>;
  }

  if (!userData) {
    return (
      <PageLayout>
        <div className="loading-container">
          <h2>Please log in to see your profile.</h2>
        </div>
      </PageLayout>
    );
  }

  const accuracy = getAccuracy(userData.correctAnswers, userData.questionsAnswered);
  
  // Match the user's earned badge IDs with the full badge data
  const earnedBadges = (userData.badges || [])
    .map(badgeId => allBadgesData.find(b => b.id === badgeId))
    .filter(Boolean); // Filter out any nulls if a badge isn't found

  return (
    <PageLayout>
      <div className="profile-container">
        {/* --- Profile Header and Stats Grid (same as before) --- */}
        <motion.div 
          className="profile-header"
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
        >
          <div className="profile-avatar">🚂</div>
          <h1 className="profile-name">{userData.displayName}</h1>
          <button className="edit-profile-btn"><FaUserEdit /> Edit</button>
        </motion.div>
        
        <div className="profile-stats-grid">
          <motion.div className="stat-card" whileHover={{ scale: 1.05 }}>
            <FaStar className="stat-icon" color="#F1C40F" />
            <h3>Total Score</h3>
            <p>{userData.totalScore}</p>
          </motion.div>
          <motion.div className="stat-card" whileHover={{ scale: 1.05 }}>
            <FaCheckCircle className="stat-icon" color="#2ECC71" />
            <h3>Accuracy</h3>
            <p>{accuracy}%</p>
          </motion.div>
          <motion.div className="stat-card" whileHover={{ scale: 1.05 }}>
            <FaTrophy className="stat-icon" color="#E67E22" />
            <h3>Badges Unlocked</h3>
            <p>{earnedBadges.length}</p>
          </motion.div>
        </div>

        {/* --- New Badge Display Shelf --- */}
        <div className="profile-badges-shelf">
          <h2>My Badge Collection</h2>
          {earnedBadges.length > 0 ? (
            <div className="badges-grid-new">
              {earnedBadges.map((badge) => (
                <BadgeCard key={badge.id} badgeInfo={badge} />
              ))}
            </div>
          ) : (
            <p>No badges earned yet. Complete a journey to get your first one!</p>
          )}
        </div>
      </div>
    </PageLayout>
  );
};

export default ProfilePage;
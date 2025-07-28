// src/pages/ProfilePage.jsx

import React, { useState, useEffect } from 'react';
import PageLayout from '../components/layout/PageLayout.jsx';
import LoadingSpinner from '../components/common/LoadingSpinner.jsx';
import { useUserContext } from '../contexts/UserContext.js';
import { useAuthContext } from '../contexts/AuthContext.js';
import { FaStar, FaCheckCircle, FaTrophy, FaUserEdit, FaSync, FaGem, FaMapMarkedAlt } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { getAccuracy } from '../utils/gameLogic.js';
import { 
  getBadgesByIds, 
  getAllBadges, 
  getBadgeStats,
  isValidBadgeId,
  getBadgeById,
  migrateLegacyBadges,
  normalizeBadgeId
} from '../utils/badgeManager.js';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../services/firestore.js';

// Enhanced Badge Card with beautiful animations
const BadgeCard = ({ badgeInfo, isEarned = false, isNext = false }) => {
  if (!badgeInfo) return null;
  
  return (
    <motion.div
      className={`professional-badge-card ${isEarned ? 'earned' : 'locked'} ${isNext ? 'next-target' : ''}`}
      title={badgeInfo.description}
      initial={{ opacity: 0, scale: 0.8, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      whileHover={{ 
        scale: isEarned ? 1.1 : 1.05, 
        y: -5,
        transition: { duration: 0.2 }
      }}
      transition={{ duration: 0.3 }}
    >
      <div className="badge-glow"></div>
      <div className={`badge-icon-container ${isEarned ? 'earned' : 'locked'}`}>
        <span className="badge-icon">{badgeInfo.icon}</span>
        {isEarned && <div className="earned-sparkle">✨</div>}
        {isNext && !isEarned && <div className="next-indicator">NEXT</div>}
      </div>
      <div className="badge-details">
        <h4 className="badge-name">{badgeInfo.name}</h4>
        <p className="badge-description">{badgeInfo.description}</p>
      </div>
      {isEarned && (
        <motion.div 
          className="completion-badge"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          <FaCheckCircle />
        </motion.div>
      )}
    </motion.div>
  );
};

const ProfilePage = () => {
  const { userData, userLoading, updateUserData } = useUserContext();
  const { user } = useAuthContext();
  const [refreshing, setRefreshing] = useState(false);
  const [badgeData, setBadgeData] = useState({
    earned: [],
    all: [],
    stats: { earned: 0, total: 0, percentage: 0 }
  });

  // Function to migrate legacy badges
  const migrateBadges = async () => {
    if (!user?.uid || !userData?.badges) return;
    
    const legacyBadges = userData.badges;
    const migratedBadges = migrateLegacyBadges(legacyBadges);
    
    console.log('Migrating badges:', {
      before: legacyBadges,
      after: migratedBadges
    });
    
    if (migratedBadges.length > 0) {
      try {
        await updateUserData({ badges: migratedBadges });
        console.log('✅ Badge migration completed successfully');
      } catch (error) {
        console.error('❌ Badge migration failed:', error);
      }
    }
  };

  // Function to refresh user data directly from Firebase
  const refreshUserData = async () => {
    if (!user?.uid) return;
    
    setRefreshing(true);
    try {
      const userDocRef = doc(db, 'users', user.uid);
      const userDoc = await getDoc(userDocRef);
      
      if (userDoc.exists()) {
        const freshData = userDoc.data();
        console.log('Fresh Firebase data:', freshData);
        console.log('Fresh badges from Firebase:', freshData.badges);
        
        // Force update the context with fresh data
        await updateUserData(freshData);
      }
    } catch (error) {
      console.error('Error refreshing user data:', error);
    } finally {
      setRefreshing(false);
    }
  };

  // Process badge data whenever userData changes
  useEffect(() => {
    if (userData) {
      const userBadgeIds = userData.badges || [];
      console.log('Processing badges from userData:', userBadgeIds);
      
      // Get all available badges
      const allBadgesData = getAllBadges();
      
      // Enhanced badge processing with flexible matching
      const validBadges = [];
      const invalidBadges = [];
      
      userBadgeIds.forEach(badgeIdentifier => {
        const badge = getBadgeById(badgeIdentifier);
        if (badge) {
          validBadges.push(badge);
          console.log(`✓ Found badge: "${badgeIdentifier}" → ${badge.name} (${badge.id})`);
        } else {
          invalidBadges.push(badgeIdentifier);
          console.warn(`✗ Invalid badge identifier: "${badgeIdentifier}"`);
        }
      });
      
      // Get badge statistics
      const badgeStats = getBadgeStats(validBadges.map(b => b.id));
      
      setBadgeData({
        earned: validBadges,
        all: allBadgesData,
        stats: badgeStats
      });
      
      console.log('Badge processing complete:', {
        rawBadgeIdentifiers: userBadgeIds,
        validBadges: validBadges.length,
        invalidBadges: invalidBadges.length,
        earnedBadgeNames: validBadges.map(b => b.name),
        earnedBadgeIds: validBadges.map(b => b.id),
        stats: badgeStats
      });
      
      // Show detailed mapping in debug
      if (invalidBadges.length > 0) {
        console.group('🔍 Badge Mapping Analysis');
        invalidBadges.forEach(invalid => {
          console.log(`"${invalid}" - No match found`);
          // Try to suggest possible matches
          const suggestions = allBadgesData.filter(badge => 
            badge.name.toLowerCase().includes(invalid.toLowerCase().substring(0, 5)) ||
            invalid.toLowerCase().includes(badge.name.toLowerCase().substring(0, 5))
          );
          if (suggestions.length > 0) {
            console.log(`  Possible matches: ${suggestions.map(s => s.name).join(', ')}`);
          }
        });
        console.groupEnd();
      }
    }
  }, [userData]);

  if (userLoading) {
    return (
      <PageLayout>
        <div className="loading-container">
          <LoadingSpinner />
          <p>Loading your profile...</p>
        </div>
      </PageLayout>
    );
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

  return (
    <PageLayout>
      <div className="profile-container revolutionary-profile">
        {/* Professional Header */}
        <motion.div 
          className="profile-hero-section"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="profile-hero-background">
            <div className="hero-particles"></div>
          </div>
          
          <div className="profile-hero-content">
            <motion.div 
              className="profile-avatar-container"
              whileHover={{ scale: 1.1, rotate: 5 }}
            >
              <div className="profile-avatar">🚂</div>
              <div className="avatar-ring"></div>
            </motion.div>
            
            <h1 className="profile-name">{userData.displayName}</h1>
            <p className="profile-title">Rail Master Explorer</p>
            
            <motion.button 
              className="refresh-data-btn"
              onClick={refreshUserData}
              disabled={refreshing}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <FaSync className={refreshing ? 'spinning' : ''} />
              {refreshing ? 'Refreshing...' : 'Refresh Data'}
            </motion.button>
          </div>
        </motion.div>

        {/* Enhanced Stats Grid */}
        <motion.div 
          className="profile-stats-grid-enhanced"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          <motion.div className="stat-card-enhanced" whileHover={{ scale: 1.05, y: -5 }}>
            <div className="stat-icon-container">
              <FaStar className="stat-icon" />
            </div>
            <div className="stat-content">
              <h3>Total Score</h3>
              <p className="stat-value">{userData.totalScore.toLocaleString()}</p>
              <span className="stat-label">Points Earned</span>
            </div>
          </motion.div>
          
          <motion.div className="stat-card-enhanced" whileHover={{ scale: 1.05, y: -5 }}>
            <div className="stat-icon-container">
              <FaCheckCircle className="stat-icon" />
            </div>
            <div className="stat-content">
              <h3>Accuracy</h3>
              <p className="stat-value">{accuracy}%</p>
              <span className="stat-label">Correct Answers</span>
            </div>
          </motion.div>
          
          <motion.div className="stat-card-enhanced" whileHover={{ scale: 1.05, y: -5 }}>
            <div className="stat-icon-container">
              <FaTrophy className="stat-icon" />
            </div>
            <div className="stat-content">
              <h3>Badges</h3>
              <p className="stat-value">{badgeData.stats.earned}/{badgeData.stats.total}</p>
              <span className="stat-label">{badgeData.stats.percentage}% Complete</span>
            </div>
          </motion.div>
          
          <motion.div className="stat-card-enhanced" whileHover={{ scale: 1.05, y: -5 }}>
            <div className="stat-icon-container">
              <FaMapMarkedAlt className="stat-icon" />
            </div>
            <div className="stat-content">
              <h3>Current Level</h3>
              <p className="stat-value">{userData.currentLevel || 1}</p>
              <span className="stat-label">Journey Progress</span>
            </div>
          </motion.div>
        </motion.div>

        {/* Revolutionary Badge Showcase */}
        <motion.div 
          className="badges-showcase-section"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          <div className="section-header">
            <div className="header-content">
              <FaGem className="section-icon" />
              <h2>Badge Collection</h2>
              <div className="progress-indicator">
                <span className="progress-text">
                  {badgeData.stats.earned} of {badgeData.stats.total} badges earned
                </span>
                <div className="progress-bar">
                  <motion.div 
                    className="progress-fill"
                    initial={{ width: 0 }}
                    animate={{ width: `${badgeData.stats.percentage}%` }}
                    transition={{ delay: 0.6, duration: 1 }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Debug Info for Development */}
          {process.env.NODE_ENV === 'development' && (
            <motion.div 
              className="debug-panel"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
            >
              <h4>🔧 Debug Information</h4>
              <div className="debug-content">
                <p><strong>Raw Firebase badges:</strong> {JSON.stringify(userData.badges || [])}</p>
                <p><strong>Earned badge names:</strong> {JSON.stringify(badgeData.earned.map(b => b.name))}</p>
                <p><strong>Earned badge IDs:</strong> {JSON.stringify(badgeData.earned.map(b => b.id))}</p>
                <p><strong>Total available badges:</strong> {badgeData.all.length}</p>
                <p><strong>Earned badges count:</strong> {badgeData.earned.length}</p>
                
                {/* Badge Mapping Status */}
                <div style={{ marginTop: '1rem', padding: '1rem', background: 'rgba(255,255,255,0.1)', borderRadius: '8px' }}>
                  <strong>Badge Mapping Status:</strong>
                  {(userData.badges || []).map((rawBadge, index) => {
                    const foundBadge = getBadgeById(rawBadge);
                    return (
                      <div key={index} style={{ 
                        color: foundBadge ? '#4CAF50' : '#F44336',
                        marginTop: '0.5rem',
                        fontFamily: 'monospace'
                      }}>
                        {foundBadge ? '✓' : '✗'} "{rawBadge}" 
                        {foundBadge ? ` → ${foundBadge.name} (${foundBadge.id})` : ' → No match found'}
                      </div>
                    );
                  })}
                </div>
                
                {/* Migration Helper */}
                {badgeData.earned.length < (userData.badges || []).length && (
                  <div style={{ marginTop: '1rem', padding: '1rem', background: 'rgba(255,152,0,0.2)', borderRadius: '8px' }}>
                    <strong>⚠️ Badge Migration Needed:</strong>
                    <p>Some badges couldn't be matched. Click below to migrate legacy badge names to current system.</p>
                    <button 
                      onClick={migrateBadges}
                      style={{ 
                        background: '#FF9800', 
                        color: 'white', 
                        border: 'none', 
                        padding: '0.5rem 1rem', 
                        borderRadius: '4px',
                        cursor: 'pointer',
                        marginTop: '0.5rem',
                        marginRight: '1rem'
                      }}
                    >
                      🔄 Migrate Badges
                    </button>
                    <button 
                      onClick={refreshUserData}
                      disabled={refreshing}
                      style={{ 
                        background: '#4ECDC4', 
                        color: 'white', 
                        border: 'none', 
                        padding: '0.5rem 1rem', 
                        borderRadius: '4px',
                        cursor: 'pointer',
                        marginTop: '0.5rem'
                      }}
                    >
                      {refreshing ? '🔄 Refreshing...' : '🔄 Refresh Data'}
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* Earned Badges Section */}
          {badgeData.earned.length > 0 && (
            <div className="earned-badges-section">
              <h3 className="subsection-title">🏆 Your Achievements</h3>
              <div className="badges-grid-professional">
                <AnimatePresence>
                  {badgeData.earned.map((badge, index) => (
                    <motion.div
                      key={badge.id}
                      initial={{ opacity: 0, scale: 0.8, y: 20 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <BadgeCard badgeInfo={badge} isEarned={true} />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>
          )}

          {/* Available Badges Section */}
          <div className="available-badges-section">
            <h3 className="subsection-title">
              🎯 Available Badges ({badgeData.all.length - badgeData.earned.length} remaining)
            </h3>
            <div className="badges-grid-professional">
              <AnimatePresence>
                {badgeData.all.map((badge, index) => {
                  const isEarned = badgeData.earned.some(earned => earned.id === badge.id);
                  const isNext = !isEarned && index === badgeData.earned.length; // Next badge to earn
                  
                  return (
                    <motion.div
                      key={badge.id}
                      initial={{ opacity: 0, scale: 0.8, y: 20 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <BadgeCard 
                        badgeInfo={badge} 
                        isEarned={isEarned}
                        isNext={isNext}
                      />
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          </div>

          {/* No Badges Message */}
          {badgeData.earned.length === 0 && (
            <motion.div 
              className="no-badges-section"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <div className="no-badges-content">
                <FaTrophy className="no-badges-icon" />
                <h3>Start Your Badge Journey!</h3>
                <p>Complete levels and solve puzzles to earn your first badges.</p>
                <motion.div 
                  className="next-badge-preview"
                  whileHover={{ scale: 1.05 }}
                >
                  <p>🎯 <strong>Next Badge:</strong> First Journey</p>
                  <p>Complete Level 1 to earn your first badge!</p>
                </motion.div>
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* Call to Action */}
        <motion.div 
          className="profile-cta-section"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
        >
          <div className="cta-content">
            <h3>Ready for Your Next Adventure?</h3>
            <p>Continue your railway journey and collect more badges!</p>
            <motion.button 
              className="cta-button"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <FaMapMarkedAlt />
              Continue Journey
            </motion.button>
          </div>
        </motion.div>
      </div>
    </PageLayout>
  );
};

export default ProfilePage;
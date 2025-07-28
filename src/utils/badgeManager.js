// src/utils/badgeManager.js

import { badges as allBadgesData } from '../data/badges.js';

// Legacy badge name to ID mapping for backward compatibility
const LEGACY_BADGE_MAPPING = {
  'Deccan Starter': 'first-journey',
  'Southern Sprinter': 'royal-rider', 
  'Coastal Voyager': 'coastal-cruiser',
  'Western Wanderer': 'western-wanderer',
  'Eastern Express': 'eastern-express',
  'Rail Master': 'rail-master',
  'Perfect Score': 'perfect-score',
  'Speedster': 'speedster',
  'Math Whiz': 'math-whiz',
  'History Buff': 'history-buff'
};

/**
 * Get badge data by ID or name (flexible matching)
 * @param {string} badgeIdentifier - The badge ID or name to look up
 * @returns {object|null} Badge data or null if not found
 */
export const getBadgeById = (badgeIdentifier) => {
  if (!badgeIdentifier) return null;
  
  // First try to match by ID (exact match)
  let badge = allBadgesData.find(badge => badge.id === badgeIdentifier);
  
  // If not found, check legacy mapping
  if (!badge && LEGACY_BADGE_MAPPING[badgeIdentifier]) {
    const mappedId = LEGACY_BADGE_MAPPING[badgeIdentifier];
    badge = allBadgesData.find(badge => badge.id === mappedId);
    console.log(`🔄 Legacy badge mapping: "${badgeIdentifier}" → "${mappedId}"`);
  }
  
  // If not found, try to match by name (case-insensitive)
  if (!badge) {
    badge = allBadgesData.find(badge => 
      badge.name.toLowerCase() === badgeIdentifier.toLowerCase()
    );
  }
  
  // If still not found, try partial name matching
  if (!badge) {
    badge = allBadgesData.find(badge => 
      badge.name.toLowerCase().includes(badgeIdentifier.toLowerCase()) ||
      badgeIdentifier.toLowerCase().includes(badge.name.toLowerCase().split(' ')[0])
    );
  }
  
  return badge || null;
};

/**
 * Get multiple badges by their IDs or names
 * @param {string[]} badgeIdentifiers - Array of badge IDs or names
 * @returns {object[]} Array of badge data objects
 */
export const getBadgesByIds = (badgeIdentifiers) => {
  if (!Array.isArray(badgeIdentifiers)) return [];
  
  return badgeIdentifiers
    .map(badgeIdentifier => getBadgeById(badgeIdentifier))
    .filter(Boolean); // Remove null values
};

/**
 * Check if a badge ID or name is valid
 * @param {string} badgeIdentifier - The badge ID or name to validate
 * @returns {boolean} True if badge exists
 */
export const isValidBadgeId = (badgeIdentifier) => {
  return getBadgeById(badgeIdentifier) !== null;
};

/**
 * Normalize badge identifier to ID format
 * @param {string} badgeIdentifier - Badge ID or name
 * @returns {string|null} Normalized badge ID or null if not found
 */
export const normalizeBadgeId = (badgeIdentifier) => {
  const badge = getBadgeById(badgeIdentifier);
  return badge ? badge.id : null;
};

/**
 * Migrate legacy badge names to current badge IDs
 * @param {string[]} legacyBadges - Array of legacy badge names
 * @returns {string[]} Array of migrated badge IDs
 */
export const migrateLegacyBadges = (legacyBadges = []) => {
  return legacyBadges
    .map(badgeName => normalizeBadgeId(badgeName))
    .filter(Boolean);
};

/**
 * Add a badge to user's collection if not already present
 * @param {string[]} currentBadges - User's current badge IDs/names
 * @param {string} badgeIdentifier - Badge ID or name to add
 * @returns {string[]} Updated badge array with normalized IDs
 */
export const addBadgeIfNotExists = (currentBadges = [], badgeIdentifier) => {
  if (!badgeIdentifier || !isValidBadgeId(badgeIdentifier)) {
    console.warn(`Invalid badge identifier: ${badgeIdentifier}`);
    return currentBadges;
  }
  
  // Normalize the badge identifier to ID format
  const normalizedId = normalizeBadgeId(badgeIdentifier);
  
  // Normalize all current badges to IDs for comparison
  const normalizedBadges = currentBadges
    .map(badge => normalizeBadgeId(badge))
    .filter(Boolean);
  
  const badgeSet = new Set(normalizedBadges);
  badgeSet.add(normalizedId);
  return Array.from(badgeSet);
};

/**
 * Add multiple badges to user's collection
 * @param {string[]} currentBadges - User's current badge IDs/names
 * @param {string[]} badgeIdentifiers - Badge IDs or names to add
 * @returns {string[]} Updated badge array with normalized IDs
 */
export const addMultipleBadges = (currentBadges = [], badgeIdentifiers = []) => {
  let updatedBadges = [...currentBadges];
  
  badgeIdentifiers.forEach(badgeIdentifier => {
    updatedBadges = addBadgeIfNotExists(updatedBadges, badgeIdentifier);
  });
  
  return updatedBadges;
};

/**
 * Get badges earned for completing a specific level
 * @param {number} levelNumber - The level number completed
 * @param {number} accuracy - Accuracy percentage (0-100)
 * @param {number} completionTime - Time taken in seconds (for future speedster badge)
 * @returns {string[]} Array of badge IDs earned
 */
export const getBadgesForLevelCompletion = (levelNumber, accuracy = 0, completionTime = 0) => {
  const earnedBadges = [];
  
  // Level-specific badges based on the mapping in levels.js
  const levelBadgeMap = {
    1: 'first-journey',
    2: 'royal-rider', 
    3: 'eastern-express',
    4: 'coastal-cruiser',
    5: 'rail-master'
  };
  
  if (levelBadgeMap[levelNumber]) {
    earnedBadges.push(levelBadgeMap[levelNumber]);
  }
  
  // Accuracy-based badges
  if (accuracy === 100) {
    earnedBadges.push('perfect-score');
  }
  
  // Future: Time-based badges
  // if (completionTime < 300) { // 5 minutes
  //   earnedBadges.push('speedster');
  // }
  
  return earnedBadges.filter(badgeId => isValidBadgeId(badgeId));
};

/**
 * Get all available badge data
 * @returns {object[]} Array of all badge data
 */
export const getAllBadges = () => {
  return allBadgesData;
};

/**
 * Get user's badge completion statistics
 * @param {string[]} userBadges - User's earned badge IDs
 * @returns {object} Statistics object
 */
export const getBadgeStats = (userBadges = []) => {
  const totalBadges = allBadgesData.length;
  const earnedCount = userBadges.length;
  const completionPercentage = Math.round((earnedCount / totalBadges) * 100);
  
  return {
    earned: earnedCount,
    total: totalBadges,
    percentage: completionPercentage,
    remaining: totalBadges - earnedCount
  };
};

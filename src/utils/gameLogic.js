// src/utils/gameLogic.js
import { BADGE_UNLOCK_CRITERIA } from './constants.js';

/**
 * Checks if the user's answer is correct, ignoring case and extra spaces.
 * @param {string} userAnswer - The answer provided by the user.
 * @param {string} correctAnswer - The correct answer for the question.
 * @returns {boolean} - True if the answer is correct, false otherwise.
 */
export const checkAnswer = (userAnswer, correctAnswer) => {
  if (typeof userAnswer !== 'string' || typeof correctAnswer !== 'string') {
    return false;
  }
  return userAnswer.trim().toLowerCase() === correctAnswer.trim().toLowerCase();
};

/**
 * Calculates the score for a correctly answered question based on difficulty.
 * @param {number} difficulty - The difficulty level of the question (e.g., 1-5).
 * @returns {number} - The calculated score.
 */
export const calculateScore = (difficulty) => {
  const basePoints = 100;
  return basePoints * difficulty;
};

/**
 * Calculates the accuracy percentage.
 * @param {number} correctAnswers - The total number of correct answers.
 * @param {number} questionsAnswered - The total number of questions answered.
 * @returns {number} - The accuracy percentage (0-100). Returns 0 if no questions were answered.
 */
export const getAccuracy = (correctAnswers, questionsAnswered) => {
  if (questionsAnswered === 0) {
    return 0;
  }
  return Math.round((correctAnswers / questionsAnswered) * 100);
};

/**
 * Checks if a user has met the criteria for any new badges they haven't earned yet.
 * @param {object} userData - The user's current data from Firestore (including existing badges).
 * @param {object} sessionStats - Statistics from the just-completed game session.
 * @param {number} sessionStats.levelCompleted - The level number that was just completed.
 * @param {boolean} sessionStats.wasPerfect - If the session had 100% accuracy.
 * @returns {Array<string>} - An array of new badge IDs that the user has earned.
 */
export const checkBadgeUnlocks = (userData, sessionStats) => {
  const newBadges = [];
  const existingBadges = userData.badges || [];

  // Check for 'First Journey' badge
  if (!existingBadges.includes(BADGE_UNLOCK_CRITERIA.FIRST_JOURNEY.id)) {
    newBadges.push(BADGE_UNLOCK_CRITERIA.FIRST_JOURNEY.id);
  }

  // Check for level completion badges
  const levelBadge = Object.values(BADGE_UNLOCK_CRITERIA).find(
    (b) => b.criteria.level === sessionStats.levelCompleted
  );
  if (levelBadge && !existingBadges.includes(levelBadge.id)) {
    newBadges.push(levelBadge.id);
  }

  // Check for 'Perfect Score' badge
  if (
    sessionStats.wasPerfect &&
    !existingBadges.includes(BADGE_UNLOCK_CRITERIA.PERFECT_SCORE.id)
  ) {
    newBadges.push(BADGE_UNLOCK_CRITERIA.PERFECT_SCORE.id);
  }

  // In a real app, you would also check for cumulative stats like 'Math Whiz'
  // by checking userData.correctMathAnswers etc.

  return newBadges;
};
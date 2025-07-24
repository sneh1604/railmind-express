// src/utils/constants.js

// Defines the criteria for unlocking each badge in the game.
export const BADGE_UNLOCK_CRITERIA = {
    FIRST_JOURNEY: {
      id: 'first-journey',
      criteria: { level: 1 }, // Special case, awarded on first level completion
    },
    WESTERN_WANDERER: {
      id: 'western-wanderer',
      criteria: { level: 1 },
    },
    ROYAL_RIDER: {
      id: 'royal-rider',
      criteria: { level: 2 },
    },
    EASTERN_EXPRESS: {
      id: 'eastern-express',
      criteria: { level: 3 },
    },
    COASTAL_CRUISER: {
      id: 'coastal-cruiser',
      criteria: { level: 4 },
    },
    RAIL_MASTER: {
      id: 'rail-master',
      criteria: { level: 5 },
    },
    PERFECT_SCORE: {
      id: 'perfect-score',
      criteria: { accuracy: 100 },
    },
    // Cumulative badges would be checked against user stats, not session stats
    MATH_WHIZ: {
      id: 'math-whiz',
      criteria: { correctAnswersInSubject: { subject: 'arithmetic', count: 25 } },
    },
    HISTORY_BUFF: {
      id: 'history-buff',
      criteria: { correctAnswersInSubject: { subject: 'history', count: 25 } },
    },
  };
  
  // Game states can be used to control UI and logic flow.
  export const GAME_STATES = {
    NOT_STARTED: 'NOT_STARTED',
    LOADING: 'LOADING',
    IN_PROGRESS: 'IN_PROGRESS',
    PAUSED: 'PAUSED',
    LEVEL_COMPLETE: 'LEVEL_COMPLETE',
  };
// src/contexts/GameContext.js

import React, { createContext, useContext, useReducer, useCallback } from 'react'; // Import useCallback
import { useQuestions } from '../hooks/useQuestions.js';
import { checkAnswer, calculateScore } from '../utils/gameLogic.js';
import { GAME_STATES } from '../utils/constants.js';

const GameContext = createContext(null);

const initialState = {
  gameState: GAME_STATES.NOT_STARTED,
  level: null,
  questions: [],
  currentQuestionIndex: 0,
  score: 0,
  correctAnswers: 0,
  lastAnswerCorrect: null,
};

function gameReducer(state, action) {
  // ... (The reducer function remains the same as before)
  switch (action.type) {
    case 'START_LEVEL':
      return {
        ...initialState,
        level: action.payload.level,
        questions: action.payload.questions,
        gameState: GAME_STATES.IN_PROGRESS,
      };
    case 'SUBMIT_ANSWER': {
      const isCorrect = checkAnswer(
        action.payload.answer,
        state.questions[state.currentQuestionIndex].correctAnswer
      );
      return {
        ...state,
        lastAnswerCorrect: isCorrect,
        score: isCorrect
          ? state.score + calculateScore(state.questions[state.currentQuestionIndex].difficulty)
          : state.score,
        correctAnswers: isCorrect ? state.correctAnswers + 1 : state.correctAnswers,
      };
    }
    case 'NEXT_QUESTION': {
      if (state.currentQuestionIndex >= state.questions.length - 1) {
        return { ...state, gameState: GAME_STATES.LEVEL_COMPLETE };
      }
      return {
        ...state,
        currentQuestionIndex: state.currentQuestionIndex + 1,
        lastAnswerCorrect: null,
      };
    }
    case 'END_LEVEL':
      return {
        ...state,
        gameState: GAME_STATES.LEVEL_COMPLETE,
      };
    case 'RESET':
      return initialState;
    default:
      throw new Error(`Unhandled action type: ${action.type}`);
  }
}

export const GameProvider = ({ children }) => {
  const [state, dispatch] = useReducer(gameReducer, initialState);
  const { fetchQuestionsForLevel, loading: questionsLoading, error: questionsError } = useQuestions();

  // --- Wrap functions in useCallback ---
  const startLevel = useCallback(async (levelConfig) => {
    const questions = await fetchQuestionsForLevel(levelConfig);
    // Important: Check if questions were successfully fetched before dispatching
    if (questions && questions.length > 0) {
      dispatch({ type: 'START_LEVEL', payload: { level: levelConfig, questions } });
    }
  }, [fetchQuestionsForLevel]); // Dependency is the function from the useQuestions hook

  const submitAnswer = useCallback((answer) => {
    dispatch({ type: 'SUBMIT_ANSWER', payload: { answer } });
  }, []);

  const nextQuestion = useCallback(() => {
    dispatch({ type: 'NEXT_QUESTION' });
  }, []);

  const endLevel = useCallback(() => {
    dispatch({ type: 'END_LEVEL' });
  }, []);
  // --- End of useCallback wrapping ---

  const value = {
    ...state,
    questionsLoading,
    questionsError, // Pass the error down to the component
    startLevel,
    submitAnswer,
    nextQuestion,
    endLevel,
  };

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
};

export const useGameContext = () => {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGameContext must be used within a GameProvider');
  }
  return context;
};
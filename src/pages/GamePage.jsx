// src/pages/GamePage.jsx

// --- (All imports remain the same as the previous version) ---
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useGameContext } from '../contexts/GameContext.js';
import { useUserContext } from '../contexts/UserContext.js';
import PuzzleScene from '../components/game/PuzzleScene.jsx';
import QuestionDisplay from '../components/game/QuestionDisplay.jsx';
import AnswerInput from '../components/game/AnswerInput.jsx';
import ProgressBar from '../components/game/ProgressBar.jsx';
import ScoreBoard from '../components/game/ScoreBoard.jsx';
import LoadingSpinner from '../components/common/LoadingSpinner.jsx';
import { levels } from '../data/levels.js';
import { GAME_STATES } from '../utils/constants.js';


const GamePage = () => {
  const { levelId } = useParams();
  const navigate = useNavigate();

  const {
    gameState, level, questions, currentQuestionIndex, score, correctAnswers,
    lastAnswerCorrect, questionsLoading, startLevel, submitAnswer, nextQuestion,
  } = useGameContext();

  const { userData, updateUserData } = useUserContext();
  const [isInputDisabled, setIsInputDisabled] = useState(false);

  useEffect(() => {
    const levelConfig = levels.find(l => l.levelNumber === parseInt(levelId));
    if (levelConfig) {
      startLevel(levelConfig);
    } else {
      navigate('/levels');
    }
  }, [levelId, startLevel, navigate]);

  useEffect(() => {
    if (lastAnswerCorrect !== null) {
      setIsInputDisabled(true);
      const timer = setTimeout(() => {
        nextQuestion();
        setIsInputDisabled(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [lastAnswerCorrect, nextQuestion]);

  useEffect(() => {
    if (gameState === GAME_STATES.LEVEL_COMPLETE && userData && level) {
      // --- Level Unlocking Logic ---
      const currentUnlocked = new Set(userData.unlockedLevels);
      // Unlock the next level
      const nextLevel = level.levelNumber + 1;
      if (nextLevel <= levels.length) {
        currentUnlocked.add(nextLevel);
      }

      const currentBadges = new Set(userData.badges || []);
      currentBadges.add(level.badgeReward); // Add the badge for this level

      
      const updatedData = {
        totalScore: userData.totalScore + score,
        questionsAnswered: userData.questionsAnswered + questions.length,
        correctAnswers: userData.correctAnswers + correctAnswers,
        lastPlayed: new Date(),
        unlockedLevels: Array.from(currentUnlocked), 
        badges: Array.from(currentBadges),// Save the new array of unlocked levels
      };
      updateUserData(updatedData);
      
      // Navigate to the final map page, passing the completed level info
      navigate('/journey-complete', { state: { completedLevel: level } });
    } else if (gameState === GAME_STATES.LEVEL_COMPLETE) {
      // If user is a guest, just navigate without saving data
      navigate('/journey-complete', { state: { completedLevel: level } });
    }
  }, [gameState, navigate, score, correctAnswers, questions.length, userData, updateUserData, level]);

  // --- (The rest of the component's JSX remains the same as the previous version) ---
  if (questionsLoading || !level || !questions.length) {
    return (
      <div className="loading-container">
        <LoadingSpinner size="80px" />
        <h2>Preparing your journey...</h2>
      </div>
    );
  }
  const currentQuestion = questions[currentQuestionIndex];
  const answerState = lastAnswerCorrect === null ? 'idle' : lastAnswerCorrect ? 'correct' : 'incorrect';
  return (
    <div className="game-page-layout">
      <header className="game-header">
        <ProgressBar
          currentStep={currentQuestionIndex + 1}
          totalSteps={questions.length}
          startCity={level.startCity}
          endCity={level.endCity}
        />
        <ScoreBoard
          score={score}
          correctAnswers={correctAnswers}
          questionsAnswered={currentQuestionIndex}
        />
      </header>
      <main className="game-main-content">
        <div className="game-left-panel">
          <QuestionDisplay question={currentQuestion} />
          <AnswerInput
            question={currentQuestion}
            onSubmit={submitAnswer}
            disabled={isInputDisabled}
          />
        </div>
        <div className="game-right-panel">
          <PuzzleScene answerState={answerState} />
        </div>
      </main>
    </div>
  );
};

export default GamePage;
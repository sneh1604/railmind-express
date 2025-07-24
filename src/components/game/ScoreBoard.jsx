// src/components/game/ScoreBoard.jsx

import React, { useState, useEffect } from 'react';
import { FaStar, FaCheckCircle, FaClock } from 'react-icons/fa';

/**
 * Displays the player's score, accuracy, and a session timer.
 * @param {object} props - The component props.
 * @param {number} props.score - The player's current score.
 * @param {number} props.correctAnswers - Number of correctly answered questions.
 * @param {number} props.questionsAnswered - Number of total questions answered.
 */
const ScoreBoard = ({ score, correctAnswers, questionsAnswered }) => {
  const [time, setTime] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(prevTime => prevTime + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
    const secs = (seconds % 60).toString().padStart(2, '0');
    return `${mins}:${secs}`;
  };

  const accuracy = questionsAnswered > 0 ? ((correctAnswers / questionsAnswered) * 100).toFixed(0) : 0;

  return (
    <div className="scoreboard-container">
      <div className="stat-item">
        <FaStar className="stat-icon score" />
        <div>
          <span className="stat-label">Score</span>
          <span className="stat-value">{score}</span>
        </div>
      </div>
      <div className="stat-item">
        <FaCheckCircle className="stat-icon accuracy" />
         <div>
          <span className="stat-label">Accuracy</span>
          <span className="stat-value">{accuracy}%</span>
        </div>
      </div>
      <div className="stat-item">
        <FaClock className="stat-icon time" />
         <div>
          <span className="stat-label">Time</span>
          <span className="stat-value">{formatTime(time)}</span>
        </div>
      </div>
    </div>
  );
};

export default ScoreBoard;
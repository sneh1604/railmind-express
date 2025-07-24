// src/components/game/QuestionDisplay.jsx

import React, { useState, useEffect } from 'react';
import { FaBookmark } from 'react-icons/fa';

/**
 * Displays the current question with a typing animation.
 * @param {object} props - The component props.
 * @param {object} props.question - The question object to display.
 * @param {string} props.question.topic - The category of the question.
 * @param {string} props.question.question - The text of the question.
 */
const QuestionDisplay = ({ question }) => {
  const [displayText, setDisplayText] = useState('');

  // Typing effect for the question text
  useEffect(() => {
    setDisplayText(''); // Reset on new question
    if (question?.question) {
      let i = 0;
      const typingInterval = setInterval(() => {
        if (i < question.question.length) {
          setDisplayText(prev => prev + question.question.charAt(i));
          i++;
        } else {
          clearInterval(typingInterval);
        }
      }, 20); // Adjust speed of typing here
      return () => clearInterval(typingInterval);
    }
  }, [question]);

  if (!question) {
    return <div className="question-display-panel">Loading question...</div>;
  }

  return (
    <div className="question-display-panel">
      <div className="question-topic">
        <FaBookmark /> <span>{question.topic}</span>
      </div>
      <p className="question-text">{displayText}</p>
    </div>
  );
};

export default QuestionDisplay;
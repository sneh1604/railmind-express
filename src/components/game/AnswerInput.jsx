// src/components/game/AnswerInput.jsx

import React, { useState } from 'react';

/**
 * Renders an input field or multiple choice options for answering a question.
 * @param {object} props - The component props.
 * @param {object} props.question - The question object containing options if any.
 * @param {function} props.onSubmit - Callback function to submit the answer.
 * @param {boolean} props.disabled - Disables input after an answer is submitted.
 */
const AnswerInput = ({ question, onSubmit, disabled }) => {
  const [textAnswer, setTextAnswer] = useState('');

  const handleTextSubmit = (e) => {
    e.preventDefault();
    if (textAnswer.trim()) {
      onSubmit(textAnswer);
      setTextAnswer('');
    }
  };

  const handleOptionClick = (option) => {
    onSubmit(option);
  };

  // Render multiple-choice options if they exist
  if (question?.options && question.options.length > 0) {
    return (
      <div className="answer-options-grid">
        {question.options.map((option, index) => (
          <button
            key={index}
            className="option-btn"
            onClick={() => handleOptionClick(option)}
            disabled={disabled}
          >
            {option}
          </button>
        ))}
      </div>
    );
  }

  // Render text input form otherwise
  return (
    <form className="answer-input-form" onSubmit={handleTextSubmit}>
      <input
        type="text"
        value={textAnswer}
        onChange={(e) => setTextAnswer(e.target.value)}
        className="answer-text-input"
        placeholder="Type your answer here..."
        disabled={disabled}
        autoFocus
      />
      <button type="submit" className="answer-submit-btn" disabled={disabled}>
        Submit
      </button>
    </form>
  );
};

export default AnswerInput;
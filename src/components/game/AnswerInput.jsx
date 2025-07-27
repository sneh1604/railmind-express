// src/components/game/AnswerInput.jsx

import React, { useState } from 'react';
import { FaRocket, FaBolt, FaMagic } from 'react-icons/fa';

/**
 * Revolutionary morphing answer input with quantum-style interactions
 * @param {object} props - The component props.
 * @param {object} props.question - The question object containing options if any.
 * @param {function} props.onSubmit - Callback function to submit the answer.
 * @param {boolean} props.disabled - Disables input after an answer is submitted.
 */
const AnswerInput = ({ question, onSubmit, disabled }) => {
  const [textAnswer, setTextAnswer] = useState('');
  const [selectedOption, setSelectedOption] = useState(null);
  const [isAnimating, setIsAnimating] = useState(false);

  const handleTextSubmit = (e) => {
    e.preventDefault();
    if (textAnswer.trim() && !disabled) {
      triggerSubmitAnimation(() => {
        onSubmit(textAnswer);
        setTextAnswer('');
      });
    }
  };

  const handleOptionClick = (option) => {
    if (disabled) return;
    setSelectedOption(option);
    triggerSubmitAnimation(() => {
      onSubmit(option);
      setSelectedOption(null);
    });
  };

  const triggerSubmitAnimation = (callback) => {
    setIsAnimating(true);
    setTimeout(() => {
      callback();
      setIsAnimating(false);
    }, 800);
  };

  // Render simplified multiple-choice interface
  if (question?.options && question.options.length > 0) {
    return (
      <div className="quantum-answer-interface">
        <div className="quantum-grid">
          {question.options.map((option, index) => (
            <div
              key={`option-${index}-${option}`}
              className={`quantum-option ${selectedOption === option ? 'selected' : ''} ${disabled ? 'disabled' : ''}`}
              onClick={() => handleOptionClick(option)}
            >
              <div className="option-content">
                <div className="option-letter">
                  {String.fromCharCode(65 + index)}
                </div>
                <div className="option-text">{option}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="submission-status">
          {isAnimating && (
            <div className="quantum-transmission">
              <FaBolt className="transmission-icon" />
              <span>Processing Answer...</span>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Render simplified text input interface
  return (
    <div className="neural-input-interface">
      <div className="neural-field-container">
        <form className="neural-form" onSubmit={handleTextSubmit}>
          <div className="input-pod">
            <input
              type="text"
              value={textAnswer}
              onChange={(e) => setTextAnswer(e.target.value)}
              className="neural-text-input"
              placeholder="Enter your answer..."
              disabled={disabled}
              autoFocus
            />
          </div>
          
          <button 
            type="submit" 
            className={`neural-submit-btn ${isAnimating ? 'transmitting' : ''}`}
            disabled={disabled || !textAnswer.trim()}
          >
            <div className="btn-core">
              {isAnimating ? (
                <>
                  <FaMagic className="btn-icon spinning" />
                  <span>SUBMITTING</span>
                </>
              ) : (
                <>
                  <FaRocket className="btn-icon" />
                  <span>SUBMIT</span>
                </>
              )}
            </div>
          </button>
        </form>
      </div>
    </div>
  );
};

export default AnswerInput;
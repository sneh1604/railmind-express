// src/components/game/ProgressBar.jsx

import React from 'react';
import { FaTrain, FaMapMarkerAlt } from 'react-icons/fa';

/**
 * A progress bar visualizing the train's journey and completed questions.
 * @param {object} props - The component props.
 * @param {number} props.currentStep - The current question number (e.g., 3).
 * @param {number} props.totalSteps - The total number of questions in the level (e.g., 10).
 * @param {string} props.startCity - The name of the starting city.
 * @param {string} props.endCity - The name of the destination city.
 */
const ProgressBar = ({ currentStep, totalSteps, startCity, endCity }) => {
  const progressPercentage = totalSteps > 1 ? ((currentStep - 1) / (totalSteps - 1)) * 100 : 0;

  return (
    <div className="progress-bar-container">
      <div className="city-label start-city">{startCity}</div>
      <div className="track">
        <div className="progress-fill" style={{ width: `${progressPercentage}%` }}>
           <FaTrain className="train-icon" style={{ left: `${progressPercentage}%` }}/>
        </div>
        {/* Render markers for each stop */}
        {Array.from({ length: totalSteps }, (_, i) => (
          <FaMapMarkerAlt
            key={i}
            className={`stop-marker ${i < currentStep ? 'completed' : ''}`}
            style={{ left: `${(i / (totalSteps - 1)) * 100}%` }}
          />
        ))}
      </div>
      <div className="city-label end-city">{endCity}</div>
    </div>
  );
};

export default ProgressBar;
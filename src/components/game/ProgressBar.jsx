// src/components/game/ProgressBar.jsx

import React, { useEffect, useState } from 'react';
import { FaTrain, FaMapMarkerAlt, FaRocket, FaBolt, FaAtom } from 'react-icons/fa';

/**
 * Futuristic Quantum Railway Progress Tracker with Dimensional Travel Visualization
 * @param {object} props - The component props.
 * @param {number} props.currentStep - The current question number (e.g., 3).
 * @param {number} props.totalSteps - The total number of questions in the level (e.g., 10).
 * @param {string} props.startCity - The name of the starting city.
 * @param {string} props.endCity - The name of the destination city.
 */
const ProgressBar = ({ currentStep, totalSteps, startCity, endCity }) => {
  const progressPercentage = totalSteps > 1 ? ((currentStep - 1) / (totalSteps - 1)) * 100 : 0;
  const [energyPulse, setEnergyPulse] = useState(0);
  const [dimensionalRift, setDimensionalRift] = useState(false);

  // Energy pulse animation
  useEffect(() => {
    const interval = setInterval(() => {
      setEnergyPulse(prev => (prev + 2) % 100);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  // Trigger dimensional rift effect on progress
  useEffect(() => {
    if (currentStep > 1) {
      setDimensionalRift(true);
      setTimeout(() => setDimensionalRift(false), 1000);
    }
  }, [currentStep]);

  return (
    <div className="quantum-railway-system">
      {/* Dimensional Background */}
      <div className="dimensional-background">
        <div className="space-warp"></div>
        <div className="quantum-grid">
          {Array.from({ length: 20 }, (_, i) => (
            <div key={i} className="grid-line" style={{animationDelay: `${i * 0.1}s`}}></div>
          ))}
        </div>
      </div>

      {/* City Terminals */}
      <div className="city-terminal start-terminal">
        <div className="terminal-core">
          <div className="core-energy"></div>
          <FaAtom className="terminal-icon" />
        </div>
        <div className="terminal-info">
          <div className="terminal-label">ORIGIN NEXUS</div>
          <div className="city-name">{startCity}</div>
        </div>
        <div className="energy-streams">
          {Array.from({ length: 3 }, (_, i) => (
            <div key={i} className={`energy-stream stream-${i + 1}`}></div>
          ))}
        </div>
      </div>

      <div className="city-terminal end-terminal">
        <div className="terminal-core">
          <div className="core-energy"></div>
          <FaRocket className="terminal-icon" />
        </div>
        <div className="terminal-info">
          <div className="terminal-label">DESTINATION NEXUS</div>
          <div className="city-name">{endCity}</div>
        </div>
        <div className="energy-streams">
          {Array.from({ length: 3 }, (_, i) => (
            <div key={i} className={`energy-stream stream-${i + 1}`}></div>
          ))}
        </div>
      </div>

      {/* Quantum Railway Track */}
      <div className="quantum-track-system">
        {/* Main Track */}
        <div className="main-track">
          <div className="track-energy-flow" style={{width: `${progressPercentage}%`}}>
            <div className="energy-particles">
              {Array.from({ length: 10 }, (_, i) => (
                <div 
                  key={i} 
                  className="energy-particle"
                  style={{animationDelay: `${i * 0.2}s`}}
                ></div>
              ))}
            </div>
          </div>
          
          {/* Dimensional Rift Effect */}
          {dimensionalRift && (
            <div className="dimensional-rift" style={{left: `${progressPercentage}%`}}>
              <div className="rift-core"></div>
              <div className="rift-waves">
                {Array.from({ length: 5 }, (_, i) => (
                  <div key={i} className="rift-wave" style={{animationDelay: `${i * 0.1}s`}}></div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Quantum Train */}
        <div 
          className="quantum-train"
          style={{
            left: `calc(${progressPercentage}% - 30px)`,
            transform: `translateX(-50%) ${currentStep > 1 ? 'scale(1.2)' : 'scale(1)'}`
          }}
        >
          <div className="train-core">
            <FaTrain className="train-icon" />
            <div className="train-energy-field"></div>
          </div>
          <div className="train-trail">
            {Array.from({ length: 8 }, (_, i) => (
              <div 
                key={i} 
                className="trail-particle"
                style={{animationDelay: `${i * 0.05}s`}}
              ></div>
            ))}
          </div>
          <div className="velocity-indicator">
            <FaBolt className="velocity-icon" />
          </div>
        </div>

        {/* Quantum Waypoints */}
        {Array.from({ length: totalSteps }, (_, i) => {
          const isCompleted = i < currentStep;
          const isCurrent = i === currentStep - 1;
          const waypoint = (i / (totalSteps - 1)) * 100;
          
          return (
            <div
              key={i}
              className={`quantum-waypoint ${isCompleted ? 'completed' : ''} ${isCurrent ? 'current' : ''}`}
              style={{left: `${waypoint}%`}}
            >
              <div className="waypoint-core">
                <div className="core-ring"></div>
                <div className="core-center">
                  {isCompleted ? (
                    <div className="completion-check">✓</div>
                  ) : (
                    <div className="waypoint-number">{i + 1}</div>
                  )}
                </div>
              </div>
              
              {isCurrent && (
                <div className="current-indicator">
                  <div className="indicator-pulse"></div>
                  <div className="indicator-rings">
                    {Array.from({ length: 3 }, (_, j) => (
                      <div key={j} className="indicator-ring" style={{animationDelay: `${j * 0.3}s`}}></div>
                    ))}
                  </div>
                </div>
              )}
              
              {isCompleted && (
                <div className="completion-aura">
                  <div className="aura-ring"></div>
                  <div className="energy-wisps">
                    {Array.from({ length: 6 }, (_, j) => (
                      <div key={j} className="energy-wisp" style={{animationDelay: `${j * 0.1}s`}}></div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Progress Statistics */}
      <div className="progress-stats">
        <div className="stat-container">
          <div className="stat-label">NEURAL PROGRESS</div>
          <div className="stat-value">{Math.round(progressPercentage)}%</div>
          <div className="stat-bar">
            <div className="stat-fill" style={{width: `${progressPercentage}%`}}></div>
          </div>
        </div>
        
        <div className="stat-container">
          <div className="stat-label">WAYPOINTS</div>
          <div className="stat-value">{currentStep}/{totalSteps}</div>
          <div className="energy-meter">
            <div className="meter-fill" style={{width: `${(currentStep / totalSteps) * 100}%`}}></div>
          </div>
        </div>
      </div>

      {/* Ambient Effects */}
      <div className="ambient-quantum-effects">
        {Array.from({ length: 15 }, (_, i) => (
          <div 
            key={i} 
            className="floating-quantum-dot"
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${3 + Math.random() * 4}s`
            }}
          ></div>
        ))}
      </div>
    </div>
  );
};

export default ProgressBar;
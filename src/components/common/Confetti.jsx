// src/components/common/Confetti.jsx

import React from 'react';

// A simple, pure CSS confetti explosion component.
const Confetti = () => {
  // Create an array of 150 confetti pieces to render.
  const confettiPieces = Array.from({ length: 150 }).map((_, index) => (
    <div
      key={index}
      className="confetti-piece"
      style={{
        // Randomize properties for a more natural look
        '--x': `${Math.random() * 100}vw`, // End X position
        '--y': `${Math.random() * 100}vh`, // End Y position
        '--r': `${Math.random() * 360}deg`, // End rotation
        '--d': `${Math.random() * 1 + 0.5}s`, // Animation duration
        '--bg': `hsl(${Math.random() * 360}, 100%, 50%)`, // Random color
      }}
    />
  ));

  return <div className="confetti-container">{confettiPieces}</div>;
};

export default Confetti;
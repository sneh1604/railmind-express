// src/components/common/GameCard.jsx

import React from 'react';

/**
 * A card for displaying game levels or journeys.
 * @param {object} props - The component props.
 * @param {string} props.title - The title of the card.
 * @param {string} props.description - A short description.
 * @param {string} props.imageUrl - URL for the background image of the card.
 * @param {function} props.onClick - Function to call when the card is clicked.
 * @param {string} [props.badgeText] - Optional text for a badge on the card (e.g., "New").
 */
const GameCard = ({ title, description, imageUrl, onClick, badgeText }) => {
  const cardStyle = {
    backgroundImage: `url(${imageUrl})`,
  };

  return (
    <div className="game-card" style={cardStyle} onClick={onClick}>
      <div className="game-card-overlay"></div>
      <div className="game-card-content">
        {badgeText && <div className="game-card-badge">{badgeText}</div>}
        <h3 className="game-card-title">{title}</h3>
        <p className="game-card-description">{description}</p>
      </div>
    </div>
  );
};

export default GameCard;
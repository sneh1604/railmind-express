// src/components/common/Badge.jsx

import React from 'react';

/**
 * A component to display a small badge or label.
 * @param {object} props - The component props.
 * @param {React.ReactNode} props.children - The text or icon to display inside the badge.
 * @param {string} [props.color] - A custom background color for the badge.
 */
const Badge = ({ children, color }) => {
  const style = color ? { backgroundColor: color } : {};

  return (
    <span className="badge" style={style}>
      {children}
    </span>
  );
};

export default Badge;
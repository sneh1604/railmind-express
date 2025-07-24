// src/components/common/LoadingSpinner.jsx

import React from 'react';

/**
 * A simple CSS-based loading spinner.
 * @param {object} props - The component props.
 * @param {string} [props.size='50px'] - The width and height of the spinner.
 */
const LoadingSpinner = ({ size = '50px' }) => {
  const style = {
    width: size,
    height: size,
  };
  return <div className="loading-spinner" style={style}></div>;
};

export default LoadingSpinner;
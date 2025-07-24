// src/components/common/Button.jsx

import React from 'react';

/**
 * A reusable button component.
 * @param {object} props - The component props.
 * @param {function} props.onClick - The function to call when the button is clicked.
 * @param {React.ReactNode} props.children - The content to display inside the button.
 * @param {string} [props.variant='primary'] - The button style ('primary' or 'secondary').
 * @param {string} [props.type='button'] - The button type ('button', 'submit', 'reset').
 * @param {boolean} [props.disabled=false] - Whether the button is disabled.
 */
const Button = ({ children, onClick, variant = 'primary', type = 'button', disabled = false }) => {
  const baseClasses = 'btn';
  const variantClasses = {
    primary: 'btn-primary',
    secondary: 'btn-secondary',
  };

  const className = `${baseClasses} ${variantClasses[variant]}`;

  return (
    <button
      type={type}
      onClick={onClick}
      className={className}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export default Button;
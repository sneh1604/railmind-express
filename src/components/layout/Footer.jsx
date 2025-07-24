// src/components/layout/Footer.jsx

import React from 'react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-container">
        <p>&copy; {currentYear} RailMind Express. All Rights Reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
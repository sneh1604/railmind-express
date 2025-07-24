// src/components/layout/PageLayout.jsx

import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';

/**
 * A layout component that wraps every page.
 * It includes the Navbar and Footer.
 * @param {object} props - The component props.
 * @param {React.ReactNode} props.children - The page content to render.
 */
const PageLayout = ({ children }) => {
  return (
    <div className="page-layout">
      <Navbar />
      <main className="main-content">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default PageLayout;
// src/index.js

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.js'; // Corrected to match your filename 'App.js'

// Import all global stylesheets
import './styles/globals.css';
import './styles/components.css';
import './styles/animations.css';
import './styles/pages.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
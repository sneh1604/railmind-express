// src/App.jsx

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Import Context Providers
import { AuthProvider } from './contexts/AuthContext.js';
import { UserProvider } from './contexts/UserContext.js';
import { GameProvider } from './contexts/GameContext.js';

// Import Page Components
import HomePage from './pages/HomePage.jsx';
import ProfilePage from './pages/ProfilePage.jsx';
import LevelSelectPage from './pages/LevelSelectPage.jsx';
import GamePage from './pages/GamePage.jsx';
import FinalMapPage from './pages/FinalMapPage.jsx';
import AuthPage from './pages/AuthPage.jsx';

function App() {
  return (
    <AuthProvider>
      <UserProvider>
        <GameProvider>
          <Router>
            <Routes>
              {/* Define the route for each page in your application */}
              <Route path="/" element={<HomePage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/levels" element={<LevelSelectPage />} />
              <Route path="/game/:levelId" element={<GamePage />} />
              <Route path="/journey-complete" element={<FinalMapPage />} />
              <Route path="/auth" element={<AuthPage />} />
            </Routes>
          </Router>
        </GameProvider>
      </UserProvider>
    </AuthProvider>
  );
}

export default App;
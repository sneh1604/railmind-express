// src/components/layout/Navbar.jsx

import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { FaUserCircle, FaSignOutAlt, FaSignInAlt, FaHome, FaMapMarkedAlt, FaMedal } from 'react-icons/fa';
// import { useAuth } from '../../hooks/useAuth';

const Navbar = () => {
  // const { user, logout } = useAuth();
  const user = { displayName: 'Player1' }; // Mock user for styling
  const logout = () => alert('Logout clicked!'); // Mock function

  return (
    <nav className="navbar creative-navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand creative-brand">
          <span className="brand-icon">🚂</span> RailMind Express
        </Link>

        <ul className="navbar-nav creative-nav">
          <li>
            <NavLink to="/" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')} title="Home">
              <FaHome className="nav-icon" /> <span className="nav-label">Home</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/levels" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')} title="Levels">
              <FaMapMarkedAlt className="nav-icon" /> <span className="nav-label">Levels</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/profile" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')} title="Profile">
              <FaMedal className="nav-icon" /> <span className="nav-label">Profile</span>
            </NavLink>
          </li>
        </ul>

        <div className="navbar-user creative-user">
          {user ? (
            <>
              <FaUserCircle className="user-icon creative-user-icon" />
              <span className="user-name creative-user-name">{user.displayName}</span>
              <button onClick={logout} className="logout-btn creative-logout-btn" title="Logout">
                <FaSignOutAlt />
              </button>
            </>
          ) : (
            <NavLink to="/auth" className="nav-link creative-login-link" title="Login">
              <FaSignInAlt className="nav-icon" /> <span className="nav-label">Login</span>
            </NavLink>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
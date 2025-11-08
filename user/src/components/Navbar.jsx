import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { logoutUser } from '../firebase/auth';
import '../css/Navbar.css';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const userName = sessionStorage.getItem('userName');
  const userEmail = sessionStorage.getItem('userEmail');
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleLogout = async () => {
    await logoutUser();
    sessionStorage.clear();
    navigate('/');
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <nav className="navbar">
      <div className="navbar-content">
        <div className="navbar-left">
          <div className="logo" onClick={() => navigate('/dashboard')}>
            <span>NGO Helpify</span>
          </div>
        </div>
        
        <div className="navbar-center">
          <button 
            className={`nav-link ${isActive('/dashboard') ? 'active' : ''}`}
            onClick={() => navigate('/dashboard')}
          >
            Home
          </button>
          <button 
            className={`nav-link ${isActive('/all-ngos') ? 'active' : ''}`}
            onClick={() => navigate('/all-ngos')}
          >
            All NGOs
          </button>
          <button 
            className={`nav-link ${isActive('/my-requests') ? 'active' : ''}`}
            onClick={() => navigate('/my-requests')}
          >
            My Requests
          </button>
          <button 
            className={`nav-link ${isActive('/submit-request') ? 'active' : ''}`}
            onClick={() => navigate('/submit-request')}
          >
            Submit Request
          </button>
        </div>
        
        <div className="navbar-right">
          <div className="user-menu-wrapper">
            <div 
              className="user-info"
              onClick={() => setShowUserMenu(!showUserMenu)}
            >
              <div className="user-avatar">👤</div>
              <div className="user-details">
                <p className="user-name">{userName}</p>
                <p className="user-email">{userEmail}</p>
              </div>
            </div>
            
            {showUserMenu && (
              <div className="user-dropdown">
                <button 
                  className="dropdown-item"
                  onClick={() => {
                    navigate('/profile');
                    setShowUserMenu(false);
                  }}
                >
                  <span>👤</span>
                  Profile
                </button>
                <button 
                  className="dropdown-item"
                  onClick={() => {
                    navigate('/my-requests');
                    setShowUserMenu(false);
                  }}
                >
                  <span>📋</span>
                  My Requests
                </button>
                <hr className="dropdown-divider" />
                <button 
                  className="dropdown-item logout"
                  onClick={handleLogout}
                >
                  <span>🚪</span>
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import '../css/Sidebar.css';
import { FiBarChart2, FiClipboard, FiUsers, FiLogOut } from 'react-icons/fi';
import { FaBuilding } from 'react-icons/fa';

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { id: 'dashboard', title: 'Dashboard', icon: <FiBarChart2 />, path: '/dashboard' },
    { id: 'requests', title: 'Manage Requests', icon: <FiClipboard />, path: '/requests' },
    { id: 'ngos', title: 'Manage NGOs', icon: <FaBuilding />, path: '/ngos' },
    { id: 'users', title: 'Manage Users', icon: <FiUsers />, path: '/users' },
  ];

  const handleNavigation = (path) => navigate(path);
  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    sessionStorage.removeItem('isAuthenticated');
    sessionStorage.removeItem('adminEmail');
    navigate('/');
  };

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h1 className="sidebar-title">NGO Helpify</h1>
      </div>

      <div className="sidebar-menu">
        {menuItems.map((item) => (
          <button
            key={item.id}
            className={`sidebar-item ${isActive(item.path) ? 'active' : ''}`}
            onClick={() => handleNavigation(item.path)}
          >
            <div className="sidebar-icon">{item.icon}</div>
            <span className="sidebar-text">{item.title}</span>
            {isActive(item.path) && <div className="active-indicator" />}
          </button>
        ))}
      </div>

      <div className="sidebar-footer">
        <button className="logout-btn" onClick={handleLogout}>
          <FiLogOut className="logout-icon" />
          <span>Logout</span>
        </button>
        <p>© 2025 NGO Helpify</p>
      </div>
    </div>
  );
};

export default Sidebar;

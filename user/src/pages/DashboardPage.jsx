import React from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import '../css/DashboardPage.css';

const DashboardPage = () => {
  const navigate = useNavigate();
  const userName = sessionStorage.getItem('userName');

  return (
    <Layout>
      <div className="dashboard-content">
        <div className="welcome-section">
          <h1>Welcome back, {userName}! 👋</h1>
          <p>Find NGOs and submit requests to get help</p>
        </div>

        {/* Quick Stats */}
        <div className="stats-grid">
          <div className="stat-card" onClick={() => navigate('/my-requests')}>
            <div className="stat-info">
              <h3>Total Requests</h3>
              <p className="stat-number">0</p>
            </div>
          </div>
          <div className="stat-card" onClick={() => navigate('/my-requests')}>
            <div className="stat-info">
              <h3>Pending</h3>
              <p className="stat-number">0</p>
            </div>
          </div>
          <div className="stat-card" onClick={() => navigate('/my-requests')}>
            <div className="stat-info">
              <h3>Approved</h3>
              <p className="stat-number">0</p>
            </div>
          </div>
          <div className="stat-card" onClick={() => navigate('/my-requests')}>
            <div className="stat-info">
              <h3>Resolved</h3>
              <p className="stat-number">0</p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="quick-actions">
          <h2>Quick Actions</h2>
          <div className="actions-grid">
            <button className="action-card" onClick={() => navigate('/all-ngos')}>
              <span className="action-icon">🏢</span>
              <h3>Browse NGOs</h3>
              <p>Find NGOs near you</p>
            </button>
            <button className="action-card" onClick={() => navigate('/submit-request')}>
              <span className="action-icon">➕</span>
              <h3>Submit Request</h3>
              <p>Send a new request</p>
            </button>
            <button className="action-card" onClick={() => navigate('/my-requests')}>
              <span className="action-icon">📋</span>
              <h3>My Requests</h3>
              <p>View your requests</p>
            </button>
            <button className="action-card" onClick={() => navigate('/profile')}>
              <span className="action-icon">👤</span>
              <h3>Profile</h3>
              <p>Manage your profile</p>
            </button>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="recent-activity">
          <h2>Recent Activity</h2>
          <div className="empty-state">
            <p>📭</p>
            <p>No recent activity</p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default DashboardPage;
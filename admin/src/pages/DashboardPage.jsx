import React, { useState } from "react";
import Layout from "../components/Layout";
import "../css/DashboardPage.css";

const DashboardPage = () => {
  const [stats, setStats] = useState({
    totalRequests: 0,
    pendingRequests: 0,
    totalNGOs: 0,
    totalUsers: 0,
    approvedRequests: 0,
    rejectedRequests: 0,
  });

  const [recentRequests, setRecentRequests] = useState([]);
  const [recentNGOs, setRecentNGOs] = useState([]);

  const getStatusClass = (status) => {
    switch (status.toLowerCase()) {
      case "pending":
        return "status-pending";
      case "approved":
        return "status-approved";
      case "rejected":
        return "status-rejected";
      case "under review":
        return "status-review";
      case "verified":
        return "status-verified";
      default:
        return "";
    }
  };

  const getPriorityClass = (priority) => {
    switch (priority.toLowerCase()) {
      case "high":
        return "priority-high";
      case "medium":
        return "priority-medium";
      case "low":
        return "priority-low";
      default:
        return "";
    }
  };

  return (
    <Layout>
      <div className="dashboard-page">
        <div className="page-header">
          <div>
            <h1 className="page-title">Dashboard Overview</h1>
            <p className="page-subtitle">
              Welcome back! Here's what's happening today.
            </p>
          </div>
          <div className="header-actions">
            <button className="btn-primary">
              <span>📊</span>
              Generate Report
            </button>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-header">
              <div className="stat-icon blue">📋</div>
            </div>
            <div className="stat-info">
              <h3>Total Requests</h3>
              <p className="stat-number">{stats.totalRequests}</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-header">
              <div className="stat-icon yellow">⏳</div>
            </div>
            <div className="stat-info">
              <h3>Pending Requests</h3>
              <p className="stat-number">{stats.pendingRequests}</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-header">
              <div className="stat-icon green">🏢</div>
            </div>
            <div className="stat-info">
              <h3>Total NGOs</h3>
              <p className="stat-number">{stats.totalNGOs}</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-header">
              <div className="stat-icon purple">👥</div>
            </div>
            <div className="stat-info">
              <h3>Total Users</h3>
              <p className="stat-number">{stats.totalUsers}</p>
            </div>
          </div>
        </div>

        {/* Dashboard Columns */}
        <div className="dashboard-columns">
          {/* LEFT COLUMN */}
          <div className="dashboard-left">
            {/* Recent Requests */}
            <div className="dashboard-card">
              <div className="card-header">
                <h2 className="section-title">Recent Requests</h2>
                <button className="view-all-btn">View All →</button>
              </div>
              {recentRequests.length > 0 ? (
                <div className="table-container">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Request ID</th>
                        <th>User Name</th>
                        <th>Category</th>
                        <th>Priority</th>
                        <th>Status</th>
                        <th>Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentRequests.map((request) => (
                        <tr key={request.id}>
                          <td className="request-id">{request.id}</td>
                          <td>{request.userName}</td>
                          <td>
                            <span className="category-badge">
                              {request.category}
                            </span>
                          </td>
                          <td>
                            <span
                              className={`priority-badge ${getPriorityClass(
                                request.priority
                              )}`}
                            >
                              {request.priority}
                            </span>
                          </td>
                          <td>
                            <span
                              className={`status-badge ${getStatusClass(
                                request.status
                              )}`}
                            >
                              {request.status}
                            </span>
                          </td>
                          <td className="date-cell">{request.date}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="empty-state">
                  <p>📋</p>
                  <p>No requests available</p>
                </div>
              )}
            </div>

            {/* Recent NGO Registrations - moved under Recent Requests */}
            <div className="dashboard-card">
              <div className="card-header">
                <h2 className="section-title">Recent NGO Registrations</h2>
                <button className="view-all-btn">View All →</button>
              </div>
              {recentNGOs.length > 0 ? (
                <div className="ngo-list">
                  {recentNGOs.map((ngo) => (
                    <div key={ngo.id} className="ngo-item">
                      <div className="ngo-icon">🏢</div>
                      <div className="ngo-details">
                        <h4 className="ngo-name">{ngo.name}</h4>
                        <p className="ngo-category">{ngo.category}</p>
                        <p className="ngo-date">Joined: {ngo.joinDate}</p>
                      </div>
                      <span
                        className={`status-badge ${getStatusClass(ngo.status)}`}
                      >
                        {ngo.status}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="empty-state">
                  <p>🏢</p>
                  <p>No NGO registrations yet</p>
                </div>
              )}
            </div>
          </div>

          {/* RIGHT COLUMN */}
          <div className="dashboard-right">
            <div className="dashboard-card">
              <h2 className="section-title">Request Status Overview</h2>
              <div className="status-overview">
                <div className="status-item">
                  <div className="status-circle approved"></div>
                  <div className="status-details">
                    <p className="status-label">Approved</p>
                    <p className="status-value">{stats.approvedRequests}</p>
                  </div>
                </div>
                <div className="status-item">
                  <div className="status-circle pending"></div>
                  <div className="status-details">
                    <p className="status-label">Pending</p>
                    <p className="status-value">{stats.pendingRequests}</p>
                  </div>
                </div>
                <div className="status-item">
                  <div className="status-circle rejected"></div>
                  <div className="status-details">
                    <p className="status-label">Rejected</p>
                    <p className="status-value">{stats.rejectedRequests}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default DashboardPage;

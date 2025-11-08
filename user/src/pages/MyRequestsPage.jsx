import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import '../css/MyRequestsPage.css';

const MyRequestsPage = () => {
  const navigate = useNavigate();
  
  const [filters, setFilters] = useState({
    status: 'all',
    search: ''
  });

  const [requests, setRequests] = useState([]);

  const handleFilterChange = (field, value) => {
    setFilters({ ...filters, [field]: value });
  };

  const handleViewDetails = (requestId) => {
    navigate(`/request/${requestId}`);
  };

  const getStatusClass = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending': return 'status-pending';
      case 'approved': return 'status-approved';
      case 'rejected': return 'status-rejected';
      case 'in progress': return 'status-progress';
      case 'resolved': return 'status-resolved';
      default: return '';
    }
  };

  const getPriorityClass = (priority) => {
    switch (priority?.toLowerCase()) {
      case 'high': return 'priority-high';
      case 'medium': return 'priority-medium';
      case 'low': return 'priority-low';
      default: return '';
    }
  };

  return (
    <Layout>
      <div className="my-requests-page">
        <div className="page-header">
          <div>
            <h1 className="page-title">My Requests</h1>
            <p className="page-subtitle">Track all your submitted requests</p>
          </div>
          <button className="btn-new-request" onClick={() => navigate('/submit-request')}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 5v14M5 12h14" />
            </svg>
            New Request
          </button>
        </div>

        <div className="filters-section">
          <div className="filters-left">
            <input
              type="text"
              placeholder="Search by title..."
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              className="search-input"
            />
            <select
              value={filters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
              className="filter-select"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="in_progress">In Progress</option>
              <option value="resolved">Resolved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>

        {requests.length > 0 ? (
          <div className="requests-grid">
            {requests.map((request) => (
              <div key={request.id} className="request-card">
                <div className="request-header">
                  <div className="request-badges">
                    <span className={`status-badge ${getStatusClass(request.status)}`}>
                      {request.status}
                    </span>
                    <span className={`priority-badge ${getPriorityClass(request.priority)}`}>
                      {request.priority}
                    </span>
                  </div>
                  <span className="request-id">#{request.id}</span>
                </div>
                <div className="request-body">
                  <h3 className="request-title">{request.title}</h3>
                  <p className="request-category">
                    <span className="category-badge">{request.category}</span>
                  </p>
                  <p className="request-description">{request.description}</p>
                  <div className="request-info">
                    <p>🏢 {request.ngoName}</p>
                    <p>📅 {request.date}</p>
                  </div>
                </div>
                <div className="request-actions">
                  <button
                    className="btn-view-details"
                    onClick={() => handleViewDetails(request.id)}
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <p>📋</p>
            <p>No requests found</p>
            <p className="empty-subtitle">You haven't submitted any requests yet</p>
            <button className="btn-new-request" onClick={() => navigate('/submit-request')}>
              Submit Your First Request
            </button>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default MyRequestsPage;
import React, { useState } from 'react';
import Layout from '../components/Layout';
import '../css/ManageUsersPage.css';

const ManageUsersPage = () => {
  // State for filters
  const [filters, setFilters] = useState({
    status: 'all',
    search: '',
    fromDate: '',
    toDate: ''
  });

  // State for users data (will be fetched from backend)
  const [users, setUsers] = useState([]);
  
  // State for modals
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  // Handle filter changes
  const handleFilterChange = (field, value) => {
    setFilters({ ...filters, [field]: value });
  };

  // Handle view user details
  const handleViewUser = (user) => {
    setSelectedUser(user);
    setShowViewModal(true);
  };

  // Handle block/unblock user
  const handleToggleBlockUser = (user) => {
    const action = user.status === 'Active' ? 'block' : 'unblock';
    if (window.confirm(`Are you sure you want to ${action} ${user.name}?`)) {
      console.log(`${action} user:`, user.id);
      // TODO: Call API to block/unblock user
    }
  };

  // Handle delete user
  const handleDeleteUser = (user) => {
    if (window.confirm(`Are you sure you want to delete ${user.name}? This action cannot be undone.`)) {
      console.log('Deleting user:', user.id);
      // TODO: Call API to delete user
    }
  };

  // Get status badge class
  const getStatusClass = (status) => {
    return status === 'Active' ? 'status-active' : 'status-blocked';
  };

  return (
    <Layout>
      <div className="manage-users-page">
        {/* Page Header */}
        <div className="page-header">
          <div>
            <h1 className="page-title">Manage Users</h1>
            <p className="page-subtitle">View and manage all registered users</p>
          </div>
        </div>

        {/* Filters Section */}
        <div className="filters-card">
          <div className="filters-grid">
            {/* Status Filter */}
            <div className="filter-group">
              <label>Status</label>
              <select 
                value={filters.status} 
                onChange={(e) => handleFilterChange('status', e.target.value)}
                className="filter-select"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="blocked">Blocked</option>
              </select>
            </div>

            {/* From Date */}
            <div className="filter-group">
              <label>From Date</label>
              <input 
                type="date" 
                value={filters.fromDate}
                onChange={(e) => handleFilterChange('fromDate', e.target.value)}
                className="filter-input"
              />
            </div>

            {/* To Date */}
            <div className="filter-group">
              <label>To Date</label>
              <input 
                type="date" 
                value={filters.toDate}
                onChange={(e) => handleFilterChange('toDate', e.target.value)}
                className="filter-input"
              />
            </div>

            {/* Search */}
            <div className="filter-group search-group">
              <label>Search</label>
              <input 
                type="text" 
                placeholder="Search by name or email..."
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                className="filter-input"
              />
            </div>

            {/* Clear Filters Button */}
            <div className="filter-group">
              <label>&nbsp;</label>
              <button 
                className="btn-clear"
                onClick={() => setFilters({
                  status: 'all',
                  search: '',
                  fromDate: '',
                  toDate: ''
                })}
              >
                Clear Filters
              </button>
            </div>
          </div>
        </div>

        {/* Users Table */}
        <div className="users-card">
          {users.length > 0 ? (
            <div className="table-container">
              <table className="users-table">
                <thead>
                  <tr>
                    <th>User ID</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Location</th>
                    <th>Registration Date</th>
                    <th>Total Requests</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id}>
                      <td className="user-id">{user.id}</td>
                      <td className="user-name">{user.name}</td>
                      <td className="email-cell">{user.email}</td>
                      <td className="phone-cell">{user.phone}</td>
                      <td className="location-cell">{user.location}</td>
                      <td className="date-cell">{user.registrationDate}</td>
                      <td className="requests-count">{user.totalRequests}</td>
                      <td>
                        <span className={`status-badge ${getStatusClass(user.status)}`}>
                          {user.status}
                        </span>
                      </td>
                      <td>
                        <div className="action-buttons">
                          <button 
                            className="btn-view"
                            onClick={() => handleViewUser(user)}
                            title="View Details"
                          >
                            👁️
                          </button>
                          <button 
                            className={user.status === 'Active' ? 'btn-block' : 'btn-unblock'}
                            onClick={() => handleToggleBlockUser(user)}
                            title={user.status === 'Active' ? 'Block User' : 'Unblock User'}
                          >
                            {user.status === 'Active' ? '🚫' : '✅'}
                          </button>
                          <button 
                            className="btn-delete"
                            onClick={() => handleDeleteUser(user)}
                            title="Delete User"
                          >
                            🗑️
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="empty-state">
              <p>👥</p>
              <p>No users found</p>
              <p className="empty-subtitle">Users will appear here once they register</p>
            </div>
          )}
        </div>

        {/* View User Modal */}
        {showViewModal && selectedUser && (
          <div className="modal-overlay" onClick={() => setShowViewModal(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2>User Details</h2>
                <button className="modal-close" onClick={() => setShowViewModal(false)}>×</button>
              </div>
              <div className="modal-body">
                <div className="user-profile">
                  <div className="profile-avatar">👤</div>
                  <div className="profile-info">
                    <h3>{selectedUser.name}</h3>
                    <span className={`status-badge ${getStatusClass(selectedUser.status)}`}>
                      {selectedUser.status}
                    </span>
                  </div>
                </div>

                <div className="detail-section">
                  <h4>Personal Information</h4>
                  <div className="detail-grid">
                    <div className="detail-group">
                      <label>User ID:</label>
                      <p>{selectedUser.id}</p>
                    </div>
                    <div className="detail-group">
                      <label>Name:</label>
                      <p>{selectedUser.name}</p>
                    </div>
                    <div className="detail-group">
                      <label>Email:</label>
                      <p>{selectedUser.email}</p>
                    </div>
                    <div className="detail-group">
                      <label>Phone:</label>
                      <p>{selectedUser.phone}</p>
                    </div>
                    <div className="detail-group full-width">
                      <label>Location:</label>
                      <p>{selectedUser.location}</p>
                    </div>
                  </div>
                </div>

                <div className="detail-section">
                  <h4>Account Information</h4>
                  <div className="detail-grid">
                    <div className="detail-group">
                      <label>Registration Date:</label>
                      <p>{selectedUser.registrationDate}</p>
                    </div>
                    <div className="detail-group">
                      <label>Account Status:</label>
                      <span className={`status-badge ${getStatusClass(selectedUser.status)}`}>
                        {selectedUser.status}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="detail-section">
                  <h4>Activity Summary</h4>
                  <div className="stats-row">
                    <div className="stat-box">
                      <div className="stat-value">{selectedUser.totalRequests}</div>
                      <div className="stat-label">Total Requests</div>
                    </div>
                    <div className="stat-box">
                      <div className="stat-value">{selectedUser.pendingRequests || 0}</div>
                      <div className="stat-label">Pending Requests</div>
                    </div>
                    <div className="stat-box">
                      <div className="stat-value">{selectedUser.resolvedRequests || 0}</div>
                      <div className="stat-label">Resolved Requests</div>
                    </div>
                  </div>
                </div>

                {selectedUser.recentRequests && selectedUser.recentRequests.length > 0 && (
                  <div className="detail-section">
                    <h4>Recent Requests</h4>
                    <div className="recent-requests">
                      {selectedUser.recentRequests.map((request, index) => (
                        <div key={index} className="request-item">
                          <div className="request-info">
                            <p className="request-title">{request.title}</p>
                            <p className="request-date">{request.date}</p>
                          </div>
                          <span className={`status-badge status-${request.status.toLowerCase()}`}>
                            {request.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              <div className="modal-footer">
                <button className="btn-secondary" onClick={() => setShowViewModal(false)}>Close</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default ManageUsersPage;
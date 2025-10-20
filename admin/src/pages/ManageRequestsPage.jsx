import React, { useState } from 'react';
import Layout from '../components/Layout';
import '../css/ManageRequestsPage.css';

const ManageRequestsPage = () => {
  // State for filters
  const [filters, setFilters] = useState({
    status: 'all',
    category: 'all',
    fromDate: '',
    toDate: '',
    search: ''
  });

  // State for requests data (will be fetched from backend)
  const [requests, setRequests] = useState([]);
  
  // State for selected request details
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showModal, setShowModal] = useState(false);
  
  // State for approve/reject modal
  const [showActionModal, setShowActionModal] = useState(false);
  const [actionType, setActionType] = useState(''); // 'approve' or 'reject'
  const [selectedNGO, setSelectedNGO] = useState('');
  const [rejectionReason, setRejectionReason] = useState('');
  
  // Dummy NGO list for approval (will come from backend)
  const [ngoList] = useState([
    { id: 1, name: 'Hope Foundation', category: 'Education' },
    { id: 2, name: 'Health Plus NGO', category: 'Healthcare' },
    { id: 3, name: 'Green Earth', category: 'Environment' }
  ]);

  // Handle filter changes
  const handleFilterChange = (field, value) => {
    setFilters({ ...filters, [field]: value });
  };

  // Handle view request details
  const handleViewRequest = (request) => {
    setSelectedRequest(request);
    setShowModal(true);
  };

  // Handle approve action
  const handleApprove = (request) => {
    setSelectedRequest(request);
    setActionType('approve');
    setShowActionModal(true);
  };

  // Handle reject action
  const handleReject = (request) => {
    setSelectedRequest(request);
    setActionType('reject');
    setShowActionModal(true);
  };

  // Submit approve/reject
  const handleSubmitAction = () => {
    if (actionType === 'approve') {
      if (!selectedNGO) {
        alert('Please select an NGO');
        return;
      }
      console.log('Approving request:', selectedRequest.id, 'Assign to NGO:', selectedNGO);
      // TODO: Call API to approve request
    } else if (actionType === 'reject') {
      if (!rejectionReason.trim()) {
        alert('Please enter rejection reason');
        return;
      }
      console.log('Rejecting request:', selectedRequest.id, 'Reason:', rejectionReason);
      // TODO: Call API to reject request
    }
    
    // Reset and close modal
    setShowActionModal(false);
    setSelectedNGO('');
    setRejectionReason('');
  };

  // Get status badge class
  const getStatusClass = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending': return 'status-pending';
      case 'approved': return 'status-approved';
      case 'rejected': return 'status-rejected';
      case 'under review': return 'status-review';
      case 'in progress': return 'status-progress';
      case 'resolved': return 'status-resolved';
      default: return '';
    }
  };

  return (
    <Layout>
      <div className="manage-requests-page">
        {/* Page Header */}
        <div className="page-header">
          <div>
            <h1 className="page-title">Manage Requests</h1>
            <p className="page-subtitle">Review and manage all user requests</p>
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
                <option value="pending">Pending</option>
                <option value="under_review">Under Review</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
                <option value="in_progress">In Progress</option>
                <option value="resolved">Resolved</option>
              </select>
            </div>

            {/* Category Filter */}
            <div className="filter-group">
              <label>Category</label>
              <select 
                value={filters.category} 
                onChange={(e) => handleFilterChange('category', e.target.value)}
                className="filter-select"
              >
                <option value="all">All Categories</option>
                <option value="education">Education</option>
                <option value="healthcare">Healthcare</option>
                <option value="environment">Environment</option>
                <option value="animal_welfare">Animal Welfare</option>
                <option value="food_nutrition">Food & Nutrition</option>
                <option value="women_empowerment">Women Empowerment</option>
                <option value="child_welfare">Child Welfare</option>
                <option value="disaster_relief">Disaster Relief</option>
                <option value="others">Others</option>
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
                placeholder="Search by ID or user name..."
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
                  category: 'all',
                  fromDate: '',
                  toDate: '',
                  search: ''
                })}
              >
                Clear Filters
              </button>
            </div>
          </div>
        </div>

        {/* Requests Table */}
        <div className="requests-card">
          {requests.length > 0 ? (
            <div className="table-container">
              <table className="requests-table">
                <thead>
                  <tr>
                    <th>Request ID</th>
                    <th>User Name</th>
                    <th>Contact</th>
                    <th>Category</th>
                    <th>Title</th>
                    <th>Date</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {requests.map((request) => (
                    <tr key={request.id}>
                      <td className="request-id">{request.id}</td>
                      <td>{request.userName}</td>
                      <td className="contact-cell">{request.contact}</td>
                      <td>
                        <span className="category-badge">{request.category}</span>
                      </td>
                      <td className="title-cell">{request.title}</td>
                      <td className="date-cell">{request.date}</td>
                      <td>
                        <span className={`status-badge ${getStatusClass(request.status)}`}>
                          {request.status}
                        </span>
                      </td>
                      <td>
                        <div className="action-buttons">
                          <button 
                            className="btn-view"
                            onClick={() => handleViewRequest(request)}
                            title="View Details"
                          >
                            👁️
                          </button>
                          {request.status === 'Pending' && (
                            <>
                              <button 
                                className="btn-approve"
                                onClick={() => handleApprove(request)}
                                title="Approve"
                              >
                                ✅
                              </button>
                              <button 
                                className="btn-reject"
                                onClick={() => handleReject(request)}
                                title="Reject"
                              >
                                ❌
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="empty-state">
              <p>📋</p>
              <p>No requests found</p>
              <p className="empty-subtitle">Requests will appear here once users submit them</p>
            </div>
          )}
        </div>

        {/* View Request Modal */}
        {showModal && selectedRequest && (
          <div className="modal-overlay" onClick={() => setShowModal(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2>Request Details</h2>
                <button className="modal-close" onClick={() => setShowModal(false)}>×</button>
              </div>
              <div className="modal-body">
                <div className="detail-group">
                  <label>Request ID:</label>
                  <p>{selectedRequest.id}</p>
                </div>
                <div className="detail-group">
                  <label>User Name:</label>
                  <p>{selectedRequest.userName}</p>
                </div>
                <div className="detail-group">
                  <label>Contact:</label>
                  <p>{selectedRequest.contact}</p>
                </div>
                <div className="detail-group">
                  <label>Email:</label>
                  <p>{selectedRequest.email}</p>
                </div>
                <div className="detail-group">
                  <label>Location:</label>
                  <p>{selectedRequest.location}</p>
                </div>
                <div className="detail-group">
                  <label>Category:</label>
                  <p>{selectedRequest.category}</p>
                </div>
                <div className="detail-group">
                  <label>Title:</label>
                  <p>{selectedRequest.title}</p>
                </div>
                <div className="detail-group">
                  <label>Description:</label>
                  <p>{selectedRequest.description}</p>
                </div>
                <div className="detail-group">
                  <label>Date Submitted:</label>
                  <p>{selectedRequest.date}</p>
                </div>
                <div className="detail-group">
                  <label>Status:</label>
                  <span className={`status-badge ${getStatusClass(selectedRequest.status)}`}>
                    {selectedRequest.status}
                  </span>
                </div>
              </div>
              <div className="modal-footer">
                <button className="btn-secondary" onClick={() => setShowModal(false)}>Close</button>
              </div>
            </div>
          </div>
        )}

        {/* Approve/Reject Action Modal */}
        {showActionModal && selectedRequest && (
          <div className="modal-overlay" onClick={() => setShowActionModal(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2>{actionType === 'approve' ? 'Approve Request' : 'Reject Request'}</h2>
                <button className="modal-close" onClick={() => setShowActionModal(false)}>×</button>
              </div>
              <div className="modal-body">
                <div className="detail-group">
                  <label>Request ID:</label>
                  <p>{selectedRequest.id}</p>
                </div>
                <div className="detail-group">
                  <label>User Name:</label>
                  <p>{selectedRequest.userName}</p>
                </div>
                <div className="detail-group">
                  <label>Title:</label>
                  <p>{selectedRequest.title}</p>
                </div>

                {actionType === 'approve' ? (
                  <div className="form-group">
                    <label>Select NGO to Assign *</label>
                    <select 
                      value={selectedNGO}
                      onChange={(e) => setSelectedNGO(e.target.value)}
                      className="form-select"
                    >
                      <option value="">-- Select NGO --</option>
                      {ngoList.map((ngo) => (
                        <option key={ngo.id} value={ngo.id}>
                          {ngo.name} ({ngo.category})
                        </option>
                      ))}
                    </select>
                  </div>
                ) : (
                  <div className="form-group">
                    <label>Rejection Reason *</label>
                    <textarea
                      value={rejectionReason}
                      onChange={(e) => setRejectionReason(e.target.value)}
                      className="form-textarea"
                      rows="4"
                      placeholder="Enter reason for rejection..."
                    ></textarea>
                  </div>
                )}
              </div>
              <div className="modal-footer">
                <button className="btn-secondary" onClick={() => setShowActionModal(false)}>
                  Cancel
                </button>
                <button 
                  className={actionType === 'approve' ? 'btn-success' : 'btn-danger'}
                  onClick={handleSubmitAction}
                >
                  {actionType === 'approve' ? 'Approve & Assign' : 'Reject Request'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default ManageRequestsPage;
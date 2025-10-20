import React, { useState } from 'react';
import Layout from '../components/Layout';
import '../css/ManageNGOsPage.css';

const ManageNGOsPage = () => {
  // State for filters
  const [filters, setFilters] = useState({
    status: 'all',
    category: 'all',
    search: ''
  });

  // State for NGOs data (will be fetched from backend)
  const [ngos, setNgos] = useState([]);
  
  // State for modals
  const [showViewModal, setShowViewModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedNGO, setSelectedNGO] = useState(null);
  
  // State for form data
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    category: '',
    address: '',
    city: '',
    state: '',
    description: '',
    registrationNumber: ''
  });

  // Handle filter changes
  const handleFilterChange = (field, value) => {
    setFilters({ ...filters, [field]: value });
  };

  // Handle form input changes
  const handleInputChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      category: '',
      address: '',
      city: '',
      state: '',
      description: '',
      registrationNumber: ''
    });
  };

  // Handle view NGO
  const handleViewNGO = (ngo) => {
    setSelectedNGO(ngo);
    setShowViewModal(true);
  };

  // Handle edit NGO
  const handleEditNGO = (ngo) => {
    setSelectedNGO(ngo);
    setFormData({
      name: ngo.name,
      email: ngo.email,
      phone: ngo.phone,
      category: ngo.category,
      address: ngo.address,
      city: ngo.city,
      state: ngo.state,
      description: ngo.description,
      registrationNumber: ngo.registrationNumber
    });
    setShowEditModal(true);
  };

  // Handle add NGO
  const handleAddNGO = () => {
    // Validate form
    if (!formData.name || !formData.email || !formData.phone || !formData.category) {
      alert('Please fill all required fields');
      return;
    }
    
    console.log('Adding NGO:', formData);
    // TODO: Call API to add NGO
    
    resetForm();
    setShowAddModal(false);
  };

  // Handle update NGO
  const handleUpdateNGO = () => {
    // Validate form
    if (!formData.name || !formData.email || !formData.phone || !formData.category) {
      alert('Please fill all required fields');
      return;
    }
    
    console.log('Updating NGO:', selectedNGO.id, formData);
    // TODO: Call API to update NGO
    
    resetForm();
    setShowEditModal(false);
  };

  // Handle verify NGO
  const handleVerifyNGO = (ngo) => {
    if (window.confirm(`Are you sure you want to verify ${ngo.name}?`)) {
      console.log('Verifying NGO:', ngo.id);
      // TODO: Call API to verify NGO
    }
  };

  // Handle delete NGO
  const handleDeleteNGO = (ngo) => {
    if (window.confirm(`Are you sure you want to delete ${ngo.name}? This action cannot be undone.`)) {
      console.log('Deleting NGO:', ngo.id);
      // TODO: Call API to delete NGO
    }
  };

  // Get status badge class
  const getStatusClass = (status) => {
    return status === 'Verified' ? 'status-verified' : 'status-pending';
  };

  return (
    <Layout>
      <div className="manage-ngos-page">
        {/* Page Header */}
        <div className="page-header">
          <div>
            <h1 className="page-title">Manage NGOs</h1>
            <p className="page-subtitle">View and manage all registered NGOs</p>
          </div>
          <button className="btn-primary" onClick={() => setShowAddModal(true)}>
            <span>➕</span>
            Add New NGO
          </button>
        </div>

        {/* Filters Section */}
        <div className="filters-card">
          <div className="filters-grid">
            {/* Status Filter */}
            <div className="filter-group">
              <label>Verification Status</label>
              <select 
                value={filters.status} 
                onChange={(e) => handleFilterChange('status', e.target.value)}
                className="filter-select"
              >
                <option value="all">All Status</option>
                <option value="verified">Verified</option>
                <option value="pending">Pending Verification</option>
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

            {/* Search */}
            <div className="filter-group search-group">
              <label>Search</label>
              <input 
                type="text" 
                placeholder="Search by NGO name..."
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
                  search: ''
                })}
              >
                Clear Filters
              </button>
            </div>
          </div>
        </div>

        {/* NGOs Grid/Cards */}
        <div className="ngos-container">
          {ngos.length > 0 ? (
            <div className="ngos-grid">
              {ngos.map((ngo) => (
                <div key={ngo.id} className="ngo-card">
                  <div className="ngo-header">
                    <div className="ngo-icon">🏢</div>
                    <span className={`status-badge ${getStatusClass(ngo.status)}`}>
                      {ngo.status}
                    </span>
                  </div>
                  <div className="ngo-body">
                    <h3 className="ngo-name">{ngo.name}</h3>
                    <p className="ngo-category">{ngo.category}</p>
                    <div className="ngo-info">
                      <p>📧 {ngo.email}</p>
                      <p>📞 {ngo.phone}</p>
                      <p>📍 {ngo.city}, {ngo.state}</p>
                    </div>
                    <p className="ngo-date">Registered: {ngo.joinDate}</p>
                  </div>
                  <div className="ngo-actions">
                    <button 
                      className="btn-icon btn-view"
                      onClick={() => handleViewNGO(ngo)}
                      title="View Details"
                    >
                      👁️
                    </button>
                    <button 
                      className="btn-icon btn-edit"
                      onClick={() => handleEditNGO(ngo)}
                      title="Edit"
                    >
                      ✏️
                    </button>
                    {ngo.status === 'Pending' && (
                      <button 
                        className="btn-icon btn-verify"
                        onClick={() => handleVerifyNGO(ngo)}
                        title="Verify"
                      >
                        ✔️
                      </button>
                    )}
                    <button 
                      className="btn-icon btn-delete"
                      onClick={() => handleDeleteNGO(ngo)}
                      title="Delete"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <p>🏢</p>
              <p>No NGOs found</p>
              <p className="empty-subtitle">NGOs will appear here once registered</p>
            </div>
          )}
        </div>

        {/* View NGO Modal */}
        {showViewModal && selectedNGO && (
          <div className="modal-overlay" onClick={() => setShowViewModal(false)}>
            <div className="modal-content large" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2>NGO Details</h2>
                <button className="modal-close" onClick={() => setShowViewModal(false)}>×</button>
              </div>
              <div className="modal-body">
                <div className="detail-grid">
                  <div className="detail-group">
                    <label>NGO Name:</label>
                    <p>{selectedNGO.name}</p>
                  </div>
                  <div className="detail-group">
                    <label>Status:</label>
                    <span className={`status-badge ${getStatusClass(selectedNGO.status)}`}>
                      {selectedNGO.status}
                    </span>
                  </div>
                  <div className="detail-group">
                    <label>Registration Number:</label>
                    <p>{selectedNGO.registrationNumber}</p>
                  </div>
                  <div className="detail-group">
                    <label>Category:</label>
                    <p>{selectedNGO.category}</p>
                  </div>
                  <div className="detail-group">
                    <label>Email:</label>
                    <p>{selectedNGO.email}</p>
                  </div>
                  <div className="detail-group">
                    <label>Phone:</label>
                    <p>{selectedNGO.phone}</p>
                  </div>
                  <div className="detail-group full-width">
                    <label>Address:</label>
                    <p>{selectedNGO.address}</p>
                  </div>
                  <div className="detail-group">
                    <label>City:</label>
                    <p>{selectedNGO.city}</p>
                  </div>
                  <div className="detail-group">
                    <label>State:</label>
                    <p>{selectedNGO.state}</p>
                  </div>
                  <div className="detail-group full-width">
                    <label>Description:</label>
                    <p>{selectedNGO.description}</p>
                  </div>
                  <div className="detail-group">
                    <label>Registered Date:</label>
                    <p>{selectedNGO.joinDate}</p>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button className="btn-secondary" onClick={() => setShowViewModal(false)}>Close</button>
              </div>
            </div>
          </div>
        )}

        {/* Add NGO Modal */}
        {showAddModal && (
          <div className="modal-overlay" onClick={() => { setShowAddModal(false); resetForm(); }}>
            <div className="modal-content large" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2>Add New NGO</h2>
                <button className="modal-close" onClick={() => { setShowAddModal(false); resetForm(); }}>×</button>
              </div>
              <div className="modal-body">
                <div className="form-grid">
                  <div className="form-group">
                    <label>NGO Name *</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className="form-input"
                      placeholder="Enter NGO name"
                    />
                  </div>
                  <div className="form-group">
                    <label>Registration Number *</label>
                    <input
                      type="text"
                      value={formData.registrationNumber}
                      onChange={(e) => handleInputChange('registrationNumber', e.target.value)}
                      className="form-input"
                      placeholder="Enter registration number"
                    />
                  </div>
                  <div className="form-group">
                    <label>Email *</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className="form-input"
                      placeholder="Enter email"
                    />
                  </div>
                  <div className="form-group">
                    <label>Phone *</label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      className="form-input"
                      placeholder="Enter phone number"
                    />
                  </div>
                  <div className="form-group">
                    <label>Category *</label>
                    <select
                      value={formData.category}
                      onChange={(e) => handleInputChange('category', e.target.value)}
                      className="form-select"
                    >
                      <option value="">Select Category</option>
                      <option value="Education">Education</option>
                      <option value="Healthcare">Healthcare</option>
                      <option value="Environment">Environment</option>
                      <option value="Animal Welfare">Animal Welfare</option>
                      <option value="Food & Nutrition">Food & Nutrition</option>
                      <option value="Women Empowerment">Women Empowerment</option>
                      <option value="Child Welfare">Child Welfare</option>
                      <option value="Disaster Relief">Disaster Relief</option>
                      <option value="Others">Others</option>
                    </select>
                  </div>
                  <div className="form-group full-width">
                    <label>Address *</label>
                    <input
                      type="text"
                      value={formData.address}
                      onChange={(e) => handleInputChange('address', e.target.value)}
                      className="form-input"
                      placeholder="Enter full address"
                    />
                  </div>
                  <div className="form-group">
                    <label>City *</label>
                    <input
                      type="text"
                      value={formData.city}
                      onChange={(e) => handleInputChange('city', e.target.value)}
                      className="form-input"
                      placeholder="Enter city"
                    />
                  </div>
                  <div className="form-group">
                    <label>State *</label>
                    <input
                      type="text"
                      value={formData.state}
                      onChange={(e) => handleInputChange('state', e.target.value)}
                      className="form-input"
                      placeholder="Enter state"
                    />
                  </div>
                  <div className="form-group full-width">
                    <label>Description</label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                      className="form-textarea"
                      rows="3"
                      placeholder="Enter description about NGO services..."
                    ></textarea>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button className="btn-secondary" onClick={() => { setShowAddModal(false); resetForm(); }}>
                  Cancel
                </button>
                <button className="btn-success" onClick={handleAddNGO}>
                  Add NGO
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Edit NGO Modal */}
        {showEditModal && selectedNGO && (
          <div className="modal-overlay" onClick={() => { setShowEditModal(false); resetForm(); }}>
            <div className="modal-content large" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2>Edit NGO</h2>
                <button className="modal-close" onClick={() => { setShowEditModal(false); resetForm(); }}>×</button>
              </div>
              <div className="modal-body">
                <div className="form-grid">
                  <div className="form-group">
                    <label>NGO Name *</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className="form-input"
                      placeholder="Enter NGO name"
                    />
                  </div>
                  <div className="form-group">
                    <label>Registration Number *</label>
                    <input
                      type="text"
                      value={formData.registrationNumber}
                      onChange={(e) => handleInputChange('registrationNumber', e.target.value)}
                      className="form-input"
                      placeholder="Enter registration number"
                    />
                  </div>
                  <div className="form-group">
                    <label>Email *</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className="form-input"
                      placeholder="Enter email"
                    />
                  </div>
                  <div className="form-group">
                    <label>Phone *</label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      className="form-input"
                      placeholder="Enter phone number"
                    />
                  </div>
                  <div className="form-group">
                    <label>Category *</label>
                    <select
                      value={formData.category}
                      onChange={(e) => handleInputChange('category', e.target.value)}
                      className="form-select"
                    >
                      <option value="">Select Category</option>
                      <option value="Education">Education</option>
                      <option value="Healthcare">Healthcare</option>
                      <option value="Environment">Environment</option>
                      <option value="Animal Welfare">Animal Welfare</option>
                      <option value="Food & Nutrition">Food & Nutrition</option>
                      <option value="Women Empowerment">Women Empowerment</option>
                      <option value="Child Welfare">Child Welfare</option>
                      <option value="Disaster Relief">Disaster Relief</option>
                      <option value="Others">Others</option>
                    </select>
                  </div>
                  <div className="form-group full-width">
                    <label>Address *</label>
                    <input
                      type="text"
                      value={formData.address}
                      onChange={(e) => handleInputChange('address', e.target.value)}
                      className="form-input"
                      placeholder="Enter full address"
                    />
                  </div>
                  <div className="form-group">
                    <label>City *</label>
                    <input
                      type="text"
                      value={formData.city}
                      onChange={(e) => handleInputChange('city', e.target.value)}
                      className="form-input"
                      placeholder="Enter city"
                    />
                  </div>
                  <div className="form-group">
                    <label>State *</label>
                    <input
                      type="text"
                      value={formData.state}
                      onChange={(e) => handleInputChange('state', e.target.value)}
                      className="form-input"
                      placeholder="Enter state"
                    />
                  </div>
                  <div className="form-group full-width">
                    <label>Description</label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                      className="form-textarea"
                      rows="3"
                      placeholder="Enter description about NGO services..."
                    ></textarea>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button className="btn-secondary" onClick={() => { setShowEditModal(false); resetForm(); }}>
                  Cancel
                </button>
                <button className="btn-success" onClick={handleUpdateNGO}>
                  Update NGO
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default ManageNGOsPage;
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import '../css/AllNGOsPage.css';

// 🔹 NEW
import { db } from '../firebase/config';
import { collection, getDocs } from 'firebase/firestore';


const AllNGOsPage = () => {
  const navigate = useNavigate();
  
  // State for filters
  const [filters, setFilters] = useState({
    search: '',
    category: 'all',
    location: ''
  });

  // State for view mode
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'

  // State for NGOs data (added static data for now)
  // State for NGOs data
const [ngos, setNgos] = useState([]);
const [ngosLoading, setNgosLoading] = useState(true);
const [ngosError, setNgosError] = useState('');

useEffect(() => {
  const fetchNgos = async () => {
    try {
      setNgosLoading(true);
      setNgosError('');

      const snap = await getDocs(collection(db, 'ngos'));

      const list = snap.docs.map((docSnap) => {
        const data = docSnap.data();

        return {
          id: docSnap.id, // ⭐ important: this id will be used for view + submit
          name: data.name || 'Unnamed NGO',
          verified: data.verified ?? true,
          category: data.category || 'Others',
          email: data.email || 'Not provided',
          phone: data.phone || 'Not provided',
          location:
            data.city && data.state
              ? `${data.city}, ${data.state}`
              : data.city || data.state || 'Location not specified',
          description: data.description || 'No description available',
        };
      });

      setNgos(list);
    } catch (err) {
      console.error('Error fetching NGOs:', err);
      setNgosError('Failed to load NGOs. Please try again later.');
    } finally {
      setNgosLoading(false);
    }
  };

  fetchNgos();
}, []);


  // Handle filter changes
  const handleFilterChange = (field, value) => {
    setFilters({ ...filters, [field]: value });
  };

  // Handle view NGO details
  const handleViewDetails = (ngoId) => {
    navigate(`/ngo/${ngoId}`);
  };

  // Handle submit request to NGO
  const handleSubmitRequest = (ngo) => {
    navigate('/submit-request', { state: { ngo } });
  };

  const filteredNgos = ngos.filter((ngo) => {
  const searchMatch = ngo.name
    .toLowerCase()
    .includes(filters.search.toLowerCase().trim());

  const locationMatch = ngo.location
    .toLowerCase()
    .includes(filters.location.toLowerCase().trim());

  let categoryMatch = true;
  if (filters.category !== 'all') {
    // we just check if category text roughly contains it
    categoryMatch = (ngo.category || '')
      .toLowerCase()
      .includes(filters.category.replace('_', ' '));
  }

  return searchMatch && locationMatch && categoryMatch;
});


  return (
    <Layout>
      <div className="all-ngos-page">
        {/* Page Header */}
        <div className="page-header">
          <div>
            <h1 className="page-title">All NGOs</h1>
            <p className="page-subtitle">Browse and connect with NGOs</p>
          </div>
        </div>

        {/* Filters Section */}
        <div className="filters-section">
          <div className="filters-left">
            {/* Search */}
            <div className="search-box">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8"/>
                <path d="m21 21-4.35-4.35"/>
              </svg>
              <input
                type="text"
                placeholder="Search NGOs by name..."
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                className="search-input"
              />
            </div>

            {/* Category Filter */}
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

            {/* Location Filter */}
            <input
              type="text"
              placeholder="Filter by location..."
              value={filters.location}
              onChange={(e) => handleFilterChange('location', e.target.value)}
              className="filter-input"
            />
          </div>

          <div className="filters-right">
            {/* View Toggle */}
            <div className="view-toggle">
              <button
                className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
                onClick={() => setViewMode('grid')}
                title="Grid View"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="3" width="7" height="7"/>
                  <rect x="14" y="3" width="7" height="7"/>
                  <rect x="14" y="14" width="7" height="7"/>
                  <rect x="3" y="14" width="7" height="7"/>
                </svg>
              </button>
              <button
                className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
                onClick={() => setViewMode('list')}
                title="List View"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="8" y1="6" x2="21" y2="6"/>
                  <line x1="8" y1="12" x2="21" y2="12"/>
                  <line x1="8" y1="18" x2="21" y2="18"/>
                  <line x1="3" y1="6" x2="3.01" y2="6"/>
                  <line x1="3" y1="12" x2="3.01" y2="12"/>
                  <line x1="3" y1="18" x2="3.01" y2="18"/>
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* NGOs List/Grid */}
        {/* NGOs List/Grid */}
{ngosLoading ? (
  <div className="empty-state">
    <p>⏳ Loading NGOs...</p>
    <p className="empty-subtitle">Please wait while we fetch registered NGOs.</p>
  </div>
) : ngosError ? (
  <div className="empty-state">
    <p>⚠️ Error</p>
    <p className="empty-subtitle">{ngosError}</p>
  </div>
) : filteredNgos.length > 0 ? (
  <div className={`ngos-container ${viewMode}`}>
    {filteredNgos.map((ngo) => (
      <div key={ngo.id} className="ngo-card">
        <div className="ngo-header">
          <div className="ngo-icon">🏢</div>
          {ngo.verified && <span className="verified-badge">✓ Verified</span>}
        </div>
        <div className="ngo-body">
          <h3 className="ngo-name">{ngo.name}</h3>
          <p className="ngo-category">
            <span className="category-badge">{ngo.category}</span>
          </p>
          <div className="ngo-info">
            <p>📧 {ngo.email}</p>
            <p>📞 {ngo.phone}</p>
            <p>📍 {ngo.location}</p>
          </div>
          <p className="ngo-description">{ngo.description}</p>
        </div>
        <div className="ngo-actions">
          <button
            className="btn-view"
            onClick={() => handleViewDetails(ngo.id)}
          >
            View Details
          </button>
          <button
            className="btn-request"
            onClick={() => handleSubmitRequest(ngo)}
          >
            Submit Request
          </button>
        </div>
      </div>
    ))}
  </div>
) : (
  <div className="empty-state">
    <p>🏢</p>
    <p>No NGOs found</p>
    <p className="empty-subtitle">
      {filters.search || filters.category !== 'all' || filters.location
        ? 'Try adjusting your filters'
        : 'NGOs will appear here once registered'}
    </p>
  </div>
)}

      </div>
    </Layout>
  );
};

export default AllNGOsPage;
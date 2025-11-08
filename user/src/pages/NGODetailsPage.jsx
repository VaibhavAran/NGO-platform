import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import '../css/NGODetailsPage.css';

const NGODetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // State for NGO data (will be fetched from backend)
  const [ngo, setNgo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: Fetch NGO details from backend using id
    // Simulating data fetch
    setTimeout(() => {
      // This will be replaced with actual API call
      setNgo(null); // No data for now
      setLoading(false);
    }, 500);
  }, [id]);

  const handleSubmitRequest = () => {
    if (ngo) {
      navigate('/submit-request', { state: { ngo } });
    }
  };

  const handleGoBack = () => {
    navigate('/all-ngos');
  };

  if (loading) {
    return (
      <Layout>
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading NGO details...</p>
        </div>
      </Layout>
    );
  }

  if (!ngo) {
    return (
      <Layout>
        <div className="ngo-details-page">
          <div className="empty-state">
            <p>🏢</p>
            <p>NGO not found</p>
            <p className="empty-subtitle">The NGO you're looking for doesn't exist or has been removed</p>
            <button className="btn-back" onClick={handleGoBack}>
              ← Back to All NGOs
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="ngo-details-page">
        {/* Back Button */}
        <button className="back-button" onClick={handleGoBack}>
          ← Back to All NGOs
        </button>

        {/* NGO Header */}
        <div className="ngo-header-card">
          <div className="ngo-header-left">
            <div className="ngo-logo">🏢</div>
            <div className="ngo-header-info">
              <div className="ngo-title-row">
                <h1 className="ngo-title">{ngo.name}</h1>
                {ngo.verified && (
                  <span className="verified-badge">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                      <path d="M5 13l4 4L19 7" />
                    </svg>
                    Verified
                  </span>
                )}
              </div>
              <span className="category-badge">{ngo.category}</span>
            </div>
          </div>
          <div className="ngo-header-right">
            <button className="btn-submit-request" onClick={handleSubmitRequest}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 5v14M5 12h14" />
              </svg>
              Submit Request
            </button>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="details-grid">
          {/* Left Column */}
          <div className="details-left">
            {/* About Section */}
            <div className="details-card">
              <h2 className="section-title">About Us</h2>
              <p className="section-content">{ngo.description}</p>
            </div>

            {/* Services Section */}
            <div className="details-card">
              <h2 className="section-title">Our Services</h2>
              <ul className="services-list">
                {ngo.services && ngo.services.length > 0 ? (
                  ngo.services.map((service, index) => (
                    <li key={index}>
                      <span className="service-icon">✓</span>
                      {service}
                    </li>
                  ))
                ) : (
                  <p className="no-data">No services listed</p>
                )}
              </ul>
            </div>

            {/* Working Areas */}
            <div className="details-card">
              <h2 className="section-title">Working Areas</h2>
              <div className="areas-tags">
                {ngo.workingAreas && ngo.workingAreas.length > 0 ? (
                  ngo.workingAreas.map((area, index) => (
                    <span key={index} className="area-tag">{area}</span>
                  ))
                ) : (
                  <p className="no-data">No working areas listed</p>
                )}
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="details-right">
            {/* Contact Information */}
            <div className="details-card">
              <h2 className="section-title">Contact Information</h2>
              <div className="contact-list">
                <div className="contact-item">
                  <div className="contact-icon">📧</div>
                  <div className="contact-details">
                    <p className="contact-label">Email</p>
                    <a href={`mailto:${ngo.email}`} className="contact-value">
                      {ngo.email}
                    </a>
                  </div>
                </div>
                <div className="contact-item">
                  <div className="contact-icon">📞</div>
                  <div className="contact-details">
                    <p className="contact-label">Phone</p>
                    <a href={`tel:${ngo.phone}`} className="contact-value">
                      {ngo.phone}
                    </a>
                  </div>
                </div>
                <div className="contact-item">
                  <div className="contact-icon">📍</div>
                  <div className="contact-details">
                    <p className="contact-label">Address</p>
                    <p className="contact-value">{ngo.address}</p>
                  </div>
                </div>
                <div className="contact-item">
                  <div className="contact-icon">🌐</div>
                  <div className="contact-details">
                    <p className="contact-label">Location</p>
                    <p className="contact-value">{ngo.city}, {ngo.state}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Additional Information */}
            <div className="details-card">
              <h2 className="section-title">Additional Information</h2>
              <div className="info-list">
                <div className="info-item">
                  <span className="info-label">Registration Number</span>
                  <span className="info-value">{ngo.registrationNumber || 'N/A'}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Established</span>
                  <span className="info-value">{ngo.establishedYear || 'N/A'}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Website</span>
                  <a href={ngo.website} target="_blank" rel="noopener noreferrer" className="info-value link">
                    {ngo.website || 'N/A'}
                  </a>
                </div>
              </div>
            </div>

            {/* Statistics */}
            <div className="details-card stats-card">
              <h2 className="section-title">Statistics</h2>
              <div className="stats-grid">
                <div className="stat-item">
                  <div className="stat-number">{ngo.totalRequests || 0}</div>
                  <div className="stat-label">Total Requests</div>
                </div>
                <div className="stat-item">
                  <div className="stat-number">{ngo.resolvedRequests || 0}</div>
                  <div className="stat-label">Resolved</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default NGODetailsPage;
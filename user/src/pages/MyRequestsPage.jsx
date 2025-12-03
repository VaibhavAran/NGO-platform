import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import '../css/MyRequestsPage.css';
import { db, auth } from '../firebase/config'; // Import Firestore and auth
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore'; // Firestore functions

const MyRequestsPage = () => {
  const navigate = useNavigate();
  
  const [filters, setFilters] = useState({
    status: 'all',
    search: ''
  });

  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchRequests = async () => {
      console.log('MyRequestsPage: Starting to fetch requests...');

      if (!auth.currentUser) {
        const errMsg = 'You must be logged in to view requests.';
        setError(errMsg);
        console.error('MyRequestsPage:', errMsg);
        setLoading(false);
        return;
      }

      try {
        const q = query(
          collection(db, 'requests'),
          where('userId', '==', auth.currentUser.uid),
          orderBy('date', 'desc')
        );

        // Add timeout
        const timeoutPromise = new Promise((_, reject) =>
          setTimeout(() => reject(new Error('Fetching timed out after 10 seconds')), 10000)
        );
        const querySnapshot = await Promise.race([getDocs(q), timeoutPromise]);

        const fetchedRequests = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          date: doc.data().date?.toDate()?.toLocaleDateString() || 'N/A' // Convert timestamp to string
        }));

        console.log('MyRequestsPage: Fetched requests', fetchedRequests);
        setRequests(fetchedRequests);
      } catch (err) {
        console.error('MyRequestsPage: Error fetching requests:', err);
        setError(`Failed to load requests: ${err.message}. Check console for details.`);
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, []);

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

  // Filter requests based on status and search
  const filteredRequests = requests.filter(request => {
    const matchesStatus = filters.status === 'all' || request.status === filters.status;
    const matchesSearch = request.title.toLowerCase().includes(filters.search.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  if (loading) {
    return (
      <Layout>
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading your requests...</p>
        </div>
      </Layout>
    );
  }

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

        {error && (
          <div className="error-message">
            <p>{error}</p>
          </div>
        )}

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

        {filteredRequests.length > 0 ? (
          <div className="requests-grid">
            {filteredRequests.map((request) => (
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
                  <span className="request-id">#{request.id.slice(-6)}</span> {/* Short ID for display */}
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
            <p className="empty-subtitle">
              {filters.search || filters.status !== 'all'
                ? 'Try adjusting your filters'
                : 'You haven\'t submitted any requests yet'}
            </p>
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
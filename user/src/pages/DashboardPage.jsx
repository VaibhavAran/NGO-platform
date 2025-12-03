import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import '../css/DashboardPage.css';

import { db, auth } from '../firebase/config';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';

const DashboardPage = () => {
  const navigate = useNavigate();
  const userName = sessionStorage.getItem('userName') || 'User';

  const [firebaseUser, setFirebaseUser] = useState(null);
  const [recentRequests, setRecentRequests] = useState([]);
  const [loadingRecent, setLoadingRecent] = useState(true);

  // 🔹 Listen for login user
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (user) {
        setFirebaseUser(user);
      } else {
        setFirebaseUser(null);
        setRecentRequests([]);
        setLoadingRecent(false);
      }
    });

    return () => unsub();
  }, []);

  // 🔹 Fetch recent requests of this user
  useEffect(() => {
    const fetchRecent = async () => {
      if (!firebaseUser) return;

      try {
        setLoadingRecent(true);

        const q = query(
          collection(db, 'requests'),
          where('userId', '==', firebaseUser.uid),
          orderBy('date', 'desc')
        );

        const snap = await getDocs(q);

        const list = snap.docs.map((docSnap) => {
          const data = docSnap.data();
          const dateObj = data.date ? data.date.toDate() : null;

          return {
            id: docSnap.id,
            title: data.title || 'Untitled request',
            ngoName: data.ngoName || 'Unknown NGO',
            status: data.status || 'pending',
            dateText: dateObj ? dateObj.toLocaleDateString() : 'N/A',
          };
        });

        setRecentRequests(list.slice(0, 5));
      } catch (err) {
        console.error('Dashboard: Error loading recent activity:', err);
      } finally {
        setLoadingRecent(false);
      }
    };

    fetchRecent();
  }, [firebaseUser]);

  // 🔹 Stats
  const total = recentRequests.length;
  const pending = recentRequests.filter((r) => r.status?.startsWith('pending')).length;
  const accepted = recentRequests.filter((r) => r.status?.startsWith('accepted')).length;
  const resolved = recentRequests.filter((r) => r.status?.startsWith('resolved')).length;

  const getStatusClass = (status) => {
    if (!status) return 'status-pill status-pending';
    const s = status.toLowerCase();
    if (s.startsWith('accepted')) return 'status-pill status-accepted';
    if (s.startsWith('resolved')) return 'status-pill status-resolved';
    if (s.startsWith('rejected')) return 'status-pill status-rejected';
    return 'status-pill status-pending';
  };

  return (
    <Layout>
      <div className="dashboard-content">
        {/* Welcome / Hero */}
        <div className="welcome-section">
          <div>
            <h1>Welcome back, {userName}! 👋</h1>
            <p>Connect with NGOs and get the right help at the right time.</p>
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
            <button className="action-card action-primary" onClick={() => navigate('/submit-request')}>
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

          {loadingRecent ? (
            <div className="empty-state">
              <p>⏳</p>
              <p>Loading your recent activity...</p>
            </div>
          ) : !firebaseUser ? (
            <div className="empty-state">
              <p>🔒</p>
              <p>You are not logged in</p>
              <p className="empty-subtitle">Login to see your recent activity</p>
            </div>
          ) : recentRequests.length === 0 ? (
            <div className="empty-state">
              <p>📭</p>
              <p>No recent activity</p>
              <p className="empty-subtitle">Submit a request to see it appear here</p>
              <button
                className="empty-cta"
                onClick={() => navigate('/submit-request')}
              >
                Submit your first request →
              </button>
            </div>
          ) : (
            <div className="activity-list-wrapper">
              <ul className="activity-list">
                {recentRequests.map((req) => (
                  <li key={req.id} className="activity-item">
                    <div className="activity-left">
                      <div className="activity-icon-small">📨</div>
                      <div>
                        <p className="activity-title">{req.title}</p>
                        <p className="activity-ngo">To: {req.ngoName}</p>
                      </div>
                    </div>
                    <div className="activity-right">
                      <span className={getStatusClass(req.status)}>
                        {req.status}
                      </span>
                      <span className="activity-date">{req.dateText}</span>
                    </div>
                  </li>
                ))}
              </ul>
              <button
                className="view-all-btn"
                onClick={() => navigate('/my-requests')}
              >
                View all requests →
              </button>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default DashboardPage;

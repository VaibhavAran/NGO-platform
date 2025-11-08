import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import '../css/ProfilePage.css';

const ProfilePage = () => {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  
  const [profileData, setProfileData] = useState({
    name: sessionStorage.getItem('userName') || '',
    email: sessionStorage.getItem('userEmail') || '',
    phone: '',
    location: '',
    bio: ''
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleProfileChange = (field, value) => {
    setProfileData({ ...profileData, [field]: value });
  };

  const handlePasswordChange = (field, value) => {
    setPasswordData({ ...passwordData, [field]: value });
  };

  const handleUpdateProfile = (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    if (!profileData.name || !profileData.email) {
      setError('Name and email are required');
      setLoading(false);
      return;
    }

    setTimeout(() => {
      console.log('Updating profile:', profileData);
      // TODO: API call
      sessionStorage.setItem('userName', profileData.name);
      setSuccess('Profile updated successfully!');
      setIsEditing(false);
      setLoading(false);
    }, 1000);
  };

  const handleChangePassword = (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      setError('All password fields are required');
      setLoading(false);
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setError('New password must be at least 6 characters');
      setLoading(false);
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    setTimeout(() => {
      console.log('Changing password');
      // TODO: API call
      setSuccess('Password changed successfully!');
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setLoading(false);
    }, 1000);
  };

  return (
    <Layout>
      <div className="profile-page">
        <div className="page-header">
          <h1 className="page-title">My Profile</h1>
          <p className="page-subtitle">Manage your account settings</p>
        </div>

        {error && (
          <div className="message error-message">
            <p>{error}</p>
          </div>
        )}

        {success && (
          <div className="message success-message">
            <p>{success}</p>
          </div>
        )}

        <div className="profile-grid">
          {/* Profile Information */}
          <div className="profile-card">
            <div className="card-header">
              <h2 className="card-title">Profile Information</h2>
              {!isEditing && (
                <button 
                  className="btn-edit"
                  onClick={() => setIsEditing(true)}
                >
                  ✏️ Edit
                </button>
              )}
            </div>

            <div className="profile-avatar-section">
              <div className="profile-avatar-large">👤</div>
              <div className="avatar-info">
                <h3>{profileData.name}</h3>
                <p>{profileData.email}</p>
              </div>
            </div>

            {isEditing ? (
              <div className="profile-form">
                <div className="form-group">
                  <label className="form-label">Full Name *</label>
                  <input
                    type="text"
                    value={profileData.name}
                    onChange={(e) => handleProfileChange('name', e.target.value)}
                    className="form-input"
                    disabled={loading}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Email *</label>
                  <input
                    type="email"
                    value={profileData.email}
                    onChange={(e) => handleProfileChange('email', e.target.value)}
                    className="form-input"
                    disabled={true}
                  />
                  <p className="form-hint">Email cannot be changed</p>
                </div>

                <div className="form-group">
                  <label className="form-label">Phone Number</label>
                  <input
                    type="tel"
                    value={profileData.phone}
                    onChange={(e) => handleProfileChange('phone', e.target.value)}
                    className="form-input"
                    placeholder="Enter phone number"
                    disabled={loading}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Location</label>
                  <input
                    type="text"
                    value={profileData.location}
                    onChange={(e) => handleProfileChange('location', e.target.value)}
                    className="form-input"
                    placeholder="Enter your location"
                    disabled={loading}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Bio</label>
                  <textarea
                    value={profileData.bio}
                    onChange={(e) => handleProfileChange('bio', e.target.value)}
                    className="form-textarea"
                    rows="3"
                    placeholder="Tell us about yourself..."
                    disabled={loading}
                  ></textarea>
                </div>

                <div className="form-actions">
                  <button
                    className="btn-cancel"
                    onClick={() => setIsEditing(false)}
                    disabled={loading}
                  >
                    Cancel
                  </button>
                  <button
                    className="btn-save"
                    onClick={handleUpdateProfile}
                    disabled={loading}
                  >
                    {loading ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </div>
            ) : (
              <div className="profile-details">
                <div className="detail-item">
                  <span className="detail-label">Name</span>
                  <span className="detail-value">{profileData.name || 'Not set'}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Email</span>
                  <span className="detail-value">{profileData.email}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Phone</span>
                  <span className="detail-value">{profileData.phone || 'Not set'}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Location</span>
                  <span className="detail-value">{profileData.location || 'Not set'}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Bio</span>
                  <span className="detail-value">{profileData.bio || 'Not set'}</span>
                </div>
              </div>
            )}
          </div>

          {/* Change Password */}
          <div className="profile-card">
            <div className="card-header">
              <h2 className="card-title">Change Password</h2>
            </div>

            <div className="profile-form">
              <div className="form-group">
                <label className="form-label">Current Password *</label>
                <input
                  type="password"
                  value={passwordData.currentPassword}
                  onChange={(e) => handlePasswordChange('currentPassword', e.target.value)}
                  className="form-input"
                  placeholder="Enter current password"
                  disabled={loading}
                />
              </div>

              <div className="form-group">
                <label className="form-label">New Password *</label>
                <input
                  type="password"
                  value={passwordData.newPassword}
                  onChange={(e) => handlePasswordChange('newPassword', e.target.value)}
                  className="form-input"
                  placeholder="Enter new password (min 6 characters)"
                  disabled={loading}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Confirm New Password *</label>
                <input
                  type="password"
                  value={passwordData.confirmPassword}
                  onChange={(e) => handlePasswordChange('confirmPassword', e.target.value)}
                  className="form-input"
                  placeholder="Re-enter new password"
                  disabled={loading}
                />
              </div>

              <button
                className="btn-change-password"
                onClick={handleChangePassword}
                disabled={loading}
              >
                {loading ? 'Changing...' : 'Change Password'}
              </button>
            </div>
          </div>

        </div>
      </div>
    </Layout>
  );
};

export default ProfilePage;
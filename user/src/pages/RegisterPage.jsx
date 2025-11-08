import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { registerUser } from '../firebase/auth';
import '../css/AuthPages.css';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    location: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Validate fields
    if (!formData.name || !formData.email || !formData.phone || !formData.location || !formData.password || !formData.confirmPassword) {
      setError('Please fill in all fields');
      setLoading(false);
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address');
      setLoading(false);
      return;
    }

    // Validate phone number
    if (formData.phone.length < 10) {
      setError('Please enter a valid phone number');
      setLoading(false);
      return;
    }

    // Validate password length
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      setLoading(false);
      return;
    }

    // Validate password match
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    // Firebase Registration
    const result = await registerUser(formData.email, formData.password, formData.name);
    
    if (result.success) {
      // TODO: Save additional user data (phone, location) to Firestore or your backend
      console.log('Additional user data to save:', {
        phone: formData.phone,
        location: formData.location,
        userId: result.user.uid
      });
      
      alert('Registration successful! Please login.');
      navigate('/');
    } else {
      setError(result.error);
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box large">
        {/* Logo and Header */}
        <div className="auth-header">
          <div className="logo-circle">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
          </div>
          <h1 className="auth-title">Create Account</h1>
          <p className="auth-subtitle">Register to get started</p>
        </div>

        {/* Register Card */}
        <div className="auth-card">
          {/* Error Message */}
          {error && (
            <div className="error-message">
              <p>{error}</p>
            </div>
          )}

          {/* Name Field */}
          <div className="form-group">
            <label htmlFor="name" className="form-label">
              Full Name *
            </label>
            <input
              type="text"
              id="name"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              className="form-input"
              placeholder="Enter your full name"
              disabled={loading}
            />
          </div>

          {/* Email Field */}
          <div className="form-group">
            <label htmlFor="email" className="form-label">
              Email Address *
            </label>
            <input
              type="email"
              id="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              className="form-input"
              placeholder="Enter your email"
              disabled={loading}
            />
          </div>

          {/* Phone Field */}
          <div className="form-group">
            <label htmlFor="phone" className="form-label">
              Phone Number *
            </label>
            <input
              type="tel"
              id="phone"
              value={formData.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              className="form-input"
              placeholder="Enter your phone number"
              disabled={loading}
            />
          </div>

          {/* Location Field */}
          <div className="form-group">
            <label htmlFor="location" className="form-label">
              Location/Address *
            </label>
            <input
              type="text"
              id="location"
              value={formData.location}
              onChange={(e) => handleInputChange('location', e.target.value)}
              className="form-input"
              placeholder="Enter your location"
              disabled={loading}
            />
          </div>

          {/* Password Field */}
          <div className="form-group">
            <label htmlFor="password" className="form-label">
              Password *
            </label>
            <div className="password-wrapper">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                value={formData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                className="form-input"
                placeholder="Enter password (min 6 characters)"
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="password-toggle"
                disabled={loading}
              >
                {showPassword ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>
          </div>

          {/* Confirm Password Field */}
          <div className="form-group">
            <label htmlFor="confirmPassword" className="form-label">
              Confirm Password *
            </label>
            <div className="password-wrapper">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                id="confirmPassword"
                value={formData.confirmPassword}
                onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                className="form-input"
                placeholder="Re-enter your password"
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="password-toggle"
                disabled={loading}
              >
                {showConfirmPassword ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="submit-btn"
          >
            {loading ? 'Creating Account...' : 'Register'}
          </button>

          {/* Login Link */}
          <div className="auth-footer-link">
            <p>
              Already have an account?{' '}
              <Link to="/" className="link">Login here</Link>
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="auth-footer">
          <p>© 2024 NGO Platform. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
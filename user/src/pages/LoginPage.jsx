import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { loginUser } from '../firebase/auth';
import '../css/AuthPages.css';

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
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
    if (!formData.email || !formData.password) {
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

    // Firebase Login
    const result = await loginUser(formData.email, formData.password);
    
    if (result.success) {
      // Store user info in sessionStorage
      sessionStorage.setItem('isAuthenticated', 'true');
      sessionStorage.setItem('userEmail', result.user.email);
      sessionStorage.setItem('userName', result.user.displayName || 'User');
      sessionStorage.setItem('userId', result.user.uid);
      
      navigate('/dashboard');
    } else {
      setError(result.error);
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        {/* Logo and Header */}
        <div className="auth-header">
          <div className="logo-circle">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
          </div>
          <h1 className="auth-title">Welcome Back</h1>
          <p className="auth-subtitle">Login to your account</p>
        </div>

        {/* Login Card */}
        <div className="auth-card">
          {/* Error Message */}
          {error && (
            <div className="error-message">
              <p>{error}</p>
            </div>
          )}

          {/* Email Field */}
          <div className="form-group">
            <label htmlFor="email" className="form-label">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSubmit(e)}
              className="form-input"
              placeholder="Enter your email"
              disabled={loading}
            />
          </div>

          {/* Password Field */}
          <div className="form-group">
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <div className="password-wrapper">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                value={formData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSubmit(e)}
                className="form-input"
                placeholder="Enter your password"
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

          {/* Remember Me & Forgot Password */}
          <div className="form-options">
            <label className="remember-me">
              <input type="checkbox" />
              <span>Remember me</span>
            </label>
            <Link to="/forgot-password" className="forgot-password">
              Forgot Password?
            </Link>
          </div>

          {/* Submit Button */}
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="submit-btn"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>

          {/* Register Link */}
          <div className="auth-footer-link">
            <p>
              Don't have an account?{' '}
              <Link to="/register" className="link">Register here</Link>
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

export default LoginPage;
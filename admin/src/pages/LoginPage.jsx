import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/LoginPage.css'; // Reference to the updated CSS file

// Predefined admin credentials
const ADMIN_CREDENTIALS = {
  email: 'admin@ngo.com',
  password: 'Admin@123'
};

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!email || !password) {
      setError('Please fill in all fields');
      setLoading(false);
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address');
      setLoading(false);
      return;
    }

    // Simulate network delay and check credentials
    setTimeout(() => {
      if (email === ADMIN_CREDENTIALS.email && password === ADMIN_CREDENTIALS.password) {
        // Store authentication state
        sessionStorage.setItem('isAuthenticated', 'true');
        sessionStorage.setItem('adminEmail', email);
        
        // Redirect to dashboard
        navigate('/dashboard');
      } else {
        setError('Invalid email or password!');
        setLoading(false);
      }
    }, 1000);
  };

  return (
    <div className="login-container">
      <div className="login-box">
        {/* Logo and Header */}
        <div className="login-header">
          <div className="logo-circle">
            <img src="/logo.png" alt="NGO Helpify Logo" className="logo-img" />
          </div>
          <h1 className="login-title">NGO Helpify</h1>
        </div>

        {/* Login Card */}
        <div className="login-card">
          {/* Error Message */}
          {error && (
            <div className="error-message">
              <p>{error}</p>
            </div>
          )}

          {/* Email Field */}
          <div className="form-group">
            <i className="fas fa-user" aria-hidden="true"></i> {/* Font Awesome user icon */}
            <label htmlFor="email" className="form-label">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSubmit(e)}
              className="form-input"
              placeholder="Enter your email"
              disabled={loading}
              autoComplete="off"
            />
          </div>

          {/* Password Field */}
          <div className="form-group">
            <i className="fas fa-lock" aria-hidden="true"></i> {/* Font Awesome lock icon */}
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <div className="password-wrapper">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSubmit(e)}
                className="form-input"
                placeholder="Enter your password"
                disabled={loading}
                autoComplete="new-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="password-toggle"
                disabled={loading}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            onClick={handleSubmit}
            disabled={loading}
            className={`submit-btn ${loading ? 'loading' : ''}`}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </div>

        {/* Footer */}
        <div className="login-footer">
          <p>© 2025 NGO Helpify. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const RegisterPage = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '', lastName: '', email: '', password: '', confirmPassword: '', phone: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.firstName || !formData.email || !formData.password) {
      setError('Please fill in all required fields');
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    try {
      setLoading(true);
      const { confirmPassword, ...payload } = formData;
      await register(payload);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-page-bg">
        <div className="orb orb-1" />
        <div className="orb orb-2" />
      </div>
      <div className="form-card register-form-card">
        <div className="form-logo">🛒</div>
        <h1 className="form-title">Create Account</h1>
        <p className="form-subtitle">Join CartNest today — it's free!</p>

        {error && <div className="form-error">{error}</div>}

        <form onSubmit={handleSubmit} id="register-form">
          <div className="form-row">
            <div className="form-group">
              <label className="form-label" htmlFor="reg-firstName">First Name *</label>
              <input
                id="reg-firstName"
                type="text"
                name="firstName"
                className="form-input"
                placeholder="John"
                value={formData.firstName}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="reg-lastName">Last Name</label>
              <input
                id="reg-lastName"
                type="text"
                name="lastName"
                className="form-input"
                placeholder="Doe"
                value={formData.lastName}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="reg-email">Email Address *</label>
            <input
              id="reg-email"
              type="email"
              name="email"
              className="form-input"
              placeholder="you@example.com"
              value={formData.email}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="reg-phone">Phone Number</label>
            <input
              id="reg-phone"
              type="tel"
              name="phone"
              className="form-input"
              placeholder="9876543210"
              value={formData.phone}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="reg-password">Password *</label>
            <input
              id="reg-password"
              type="password"
              name="password"
              className="form-input"
              placeholder="Min. 6 characters"
              value={formData.password}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="reg-confirmPassword">Confirm Password *</label>
            <input
              id="reg-confirmPassword"
              type="password"
              name="confirmPassword"
              className="form-input"
              placeholder="Re-enter password"
              value={formData.confirmPassword}
              onChange={handleChange}
            />
          </div>

          <button
            type="submit"
            className="btn-primary-custom auth-submit-btn"
            disabled={loading}
            id="register-submit-btn"
          >
            {loading ? '⏳ Creating Account...' : '🚀 Create Account'}
          </button>
        </form>

        <p className="auth-switch">
          Already have an account?{' '}
          <Link to="/login" className="auth-link">Sign in →</Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;

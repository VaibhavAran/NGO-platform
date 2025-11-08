import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Layout from '../components/Layout';
import '../css/SubmitRequestPage.css';

const SubmitRequestPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const preSelectedNGO = location.state?.ngo;

  const [formData, setFormData] = useState({
    ngoId: preSelectedNGO?.id || '',
    category: '',
    title: '',
    description: '',
    priority: 'medium'
  });
  
  const [attachments, setAttachments] = useState([]);
  const [ngos, setNgos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    // TODO: Fetch NGOs from backend
    setNgos([]);
  }, []);

  const handleInputChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    
    // Validate file size (max 5MB per file)
    const maxSize = 5 * 1024 * 1024; // 5MB
    const validFiles = files.filter(file => {
      if (file.size > maxSize) {
        alert(`${file.name} is too large. Max size is 5MB.`);
        return false;
      }
      return true;
    });

    setAttachments([...attachments, ...validFiles]);
  };

  const removeAttachment = (index) => {
    setAttachments(attachments.filter((_, i) => i !== index));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!formData.ngoId || !formData.category || !formData.title || !formData.description) {
      setError('Please fill all required fields');
      setLoading(false);
      return;
    }

    setTimeout(() => {
      console.log('Submitting request:', formData);
      console.log('Attachments:', attachments);
      // TODO: API call with FormData for file upload
      alert('Request submitted successfully!');
      navigate('/my-requests');
      setLoading(false);
    }, 1000);
  };

  return (
    <Layout>
      <div className="submit-request-page">
        <div className="page-header">
          <h1 className="page-title">Submit Request</h1>
          <p className="page-subtitle">Send your request to an NGO</p>
        </div>

        <div className="form-container">
          {error && (
            <div className="error-message">
              <p>{error}</p>
            </div>
          )}

          <div className="form-card">
            {/* Select NGO */}
            <div className="form-group">
              <label className="form-label">Select NGO *</label>
              <select
                value={formData.ngoId}
                onChange={(e) => handleInputChange('ngoId', e.target.value)}
                className="form-select"
                disabled={loading || preSelectedNGO}
              >
                <option value="">-- Select an NGO --</option>
                {preSelectedNGO && (
                  <option value={preSelectedNGO.id}>{preSelectedNGO.name}</option>
                )}
                {ngos.map((ngo) => (
                  <option key={ngo.id} value={ngo.id}>{ngo.name}</option>
                ))}
              </select>
            </div>

            {/* Category */}
            <div className="form-group">
              <label className="form-label">Category *</label>
              <select
                value={formData.category}
                onChange={(e) => handleInputChange('category', e.target.value)}
                className="form-select"
                disabled={loading}
              >
                <option value="">-- Select Category --</option>
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

            {/* Priority */}
            <div className="form-group">
              <label className="form-label">Priority *</label>
              <select
                value={formData.priority}
                onChange={(e) => handleInputChange('priority', e.target.value)}
                className="form-select"
                disabled={loading}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>

            {/* Title */}
            <div className="form-group">
              <label className="form-label">Request Title *</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                className="form-input"
                placeholder="Enter a brief title for your request"
                disabled={loading}
              />
            </div>

            {/* Description */}
            <div className="form-group">
              <label className="form-label">Description *</label>
              <textarea
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                className="form-textarea"
                rows="6"
                placeholder="Describe your request in detail..."
                disabled={loading}
              ></textarea>
            </div>

            {/* Attachments */}
            <div className="form-group">
              <label className="form-label">Attachments (Optional)</label>
              <p className="form-hint">Upload images or documents as proof (Max 5MB per file)</p>
              
              <div className="file-upload-area">
                <input
                  type="file"
                  id="file-input"
                  multiple
                  accept="image/*,.pdf,.doc,.docx"
                  onChange={handleFileChange}
                  className="file-input"
                  disabled={loading}
                />
                <label htmlFor="file-input" className="file-label">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="17 8 12 3 7 8" />
                    <line x1="12" y1="3" x2="12" y2="15" />
                  </svg>
                  <span>Click to upload or drag and drop</span>
                  <span className="file-types">Images, PDF, DOC (Max 5MB)</span>
                </label>
              </div>

              {/* Attachments List */}
              {attachments.length > 0 && (
                <div className="attachments-list">
                  {attachments.map((file, index) => (
                    <div key={index} className="attachment-item">
                      <div className="attachment-icon">
                        {file.type.startsWith('image/') ? '🖼️' : '📄'}
                      </div>
                      <div className="attachment-info">
                        <p className="attachment-name">{file.name}</p>
                        <p className="attachment-size">
                          {(file.size / 1024).toFixed(2)} KB
                        </p>
                      </div>
                      <button
                        type="button"
                        className="remove-btn"
                        onClick={() => removeAttachment(index)}
                        disabled={loading}
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Buttons */}
            <div className="form-actions">
              <button
                type="button"
                className="btn-cancel"
                onClick={() => navigate(-1)}
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn-submit"
                onClick={handleSubmit}
                disabled={loading}
              >
                {loading ? 'Submitting...' : 'Submit Request'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default SubmitRequestPage;
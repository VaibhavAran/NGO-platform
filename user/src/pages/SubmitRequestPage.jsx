import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Layout from '../components/Layout';
import '../css/SubmitRequestPage.css';
import { db, auth } from '../firebase/config';
import { collection, addDoc, serverTimestamp, getDocs } from 'firebase/firestore';

const SubmitRequestPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const preSelectedNGO = location.state?.ngo; // from AllNGOs / Details page

  const [formData, setFormData] = useState({
    ngoId: preSelectedNGO?.id || '',   // Firestore doc id
    title: '',
    description: ''
  });
  
  const [attachments, setAttachments] = useState([]);
  const [ngos, setNgos] = useState([]);
  const [ngosLoading, setNgosLoading] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // 🔹 Fetch NGOs from Firestore (for dropdown)
  useEffect(() => {
    const fetchNgos = async () => {
      try {
        setNgosLoading(true);
        const snap = await getDocs(collection(db, 'ngos'));

        const list = snap.docs.map((docSnap) => {
          const data = docSnap.data();
          return {
            id: docSnap.id,                  // Firestore doc ID
            name: data.name || 'Unnamed NGO'
          };
        });

        setNgos(list);
        console.log('SubmitRequestPage: NGOs loaded from Firestore', list);
      } catch (err) {
        console.error('SubmitRequestPage: Error fetching NGOs:', err);
      } finally {
        setNgosLoading(false);
      }
    };

    fetchNgos();
  }, []);

  const handleInputChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    const maxSize = 5 * 1024 * 1024; // 5MB

    const validFiles = files.filter((file) => {
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    console.log('SubmitRequestPage: Starting submission...');

    if (!auth.currentUser) {
      const errMsg = 'You must be logged in to submit a request.';
      setError(errMsg);
      console.error('SubmitRequestPage:', errMsg);
      setLoading(false);
      return;
    }

    if (!formData.ngoId || !formData.title || !formData.description) {
      const errMsg = 'Please fill all required fields';
      setError(errMsg);
      console.error('SubmitRequestPage:', errMsg);
      setLoading(false);
      return;
    }

    try {
      // 🔹 Resolve NGO from Firestore list or preSelectedNGO
      let selectedNgo = null;

      if (preSelectedNGO && preSelectedNGO.id === formData.ngoId) {
        selectedNgo = preSelectedNGO;
      } else {
        selectedNgo = ngos.find((ngo) => ngo.id === formData.ngoId) || null;
      }

      const ngoName = selectedNgo?.name || 'Unknown NGO';
      const ngoIdToSave = selectedNgo?.id || formData.ngoId;

      // Prepare attachments metadata
      const attachmentsData = attachments.map((file) => ({
        name: file.name,
        size: file.size
      }));

      // Request object
      const requestData = {
        userId: auth.currentUser.uid,
        ngoId: ngoIdToSave,       // Firestore doc ID
        ngoName,
        title: formData.title,
        description: formData.description,
        status: 'pending',
        date: serverTimestamp(),
        attachments: attachmentsData
      };

      console.log('SubmitRequestPage: Request data prepared', requestData);

      // Add to Firestore with timeout
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(
          () => reject(new Error('Submission timed out after 10 seconds')),
          10000
        )
      );
      await Promise.race([
        addDoc(collection(db, 'requests'), requestData),
        timeoutPromise
      ]);

      console.log('SubmitRequestPage: Request submitted successfully');
      alert('Request submitted successfully!');
      navigate('/my-requests');
    } catch (err) {
      console.error('SubmitRequestPage: Error submitting request:', err);
      setError(
        `Failed to submit request: ${err.message}. Check console for details.`
      );
    } finally {
      setLoading(false);
    }
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
                disabled={loading || !!preSelectedNGO}
              >
                <option value="">
                  {ngosLoading ? 'Loading NGOs...' : '-- Select an NGO --'}
                </option>

                {preSelectedNGO && (
                  <option value={preSelectedNGO.id}>
                    {preSelectedNGO.name}
                  </option>
                )}

                {/* Only show other NGOs when not using pre-selected NGO */}
                {!preSelectedNGO &&
                  ngos.map((ngo) => (
                    <option key={ngo.id} value={ngo.id}>
                      {ngo.name}
                    </option>
                  ))}
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
              <p className="form-hint">
                Upload images or documents as proof (Max 5MB per file)
              </p>

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
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="17 8 12 3 7 8" />
                    <line x1="12" y1="3" x2="12" y2="15" />
                  </svg>
                  <span>Click to upload or drag and drop</span>
                  <span className="file-types">
                    Images, PDF, DOC (Max 5MB)
                  </span>
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

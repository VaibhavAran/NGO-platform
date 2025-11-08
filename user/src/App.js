import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import AllNGOsPage from './pages/AllNGOsPage';
import NGODetailsPage from './pages/NGODetailsPage';
import SubmitRequestPage from './pages/SubmitRequestPage';
import ProtectedRoute from './components/ProtectedRoute';
import MyRequestsPage from './pages/MyRequestsPage';
import ProfilePage from './pages/ProfilePage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
        <Route path="/all-ngos" element={<ProtectedRoute><AllNGOsPage /></ProtectedRoute>} />
        <Route path="/ngo/:id" element={<ProtectedRoute><NGODetailsPage /></ProtectedRoute>} />
        <Route path="/submit-request" element={<ProtectedRoute><SubmitRequestPage /></ProtectedRoute>} />
        <Route path="/my-requests" element={<ProtectedRoute><MyRequestsPage /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
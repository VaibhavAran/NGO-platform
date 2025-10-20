import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import ManageRequestsPage from './pages/ManageRequestsPage';
import ManageNGOsPage from './pages/ManageNGOsPage';
import ManageUsersPage from './pages/ManageUsersPage';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Router>
      <Routes>
        {/* Login Route */}
        <Route path="/" element={<LoginPage />} />
        
        {/* Protected Dashboard Route */}
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          } 
        />
        
        {/* Protected Manage Requests Route */}
        <Route 
          path="/requests" 
          element={
            <ProtectedRoute>
              <ManageRequestsPage />
            </ProtectedRoute>
          } 
        />
        
        {/* Protected Manage NGOs Route */}
        <Route 
          path="/ngos" 
          element={
            <ProtectedRoute>
              <ManageNGOsPage />
            </ProtectedRoute>
          } 
        />
        
        {/* Protected Manage Users Route */}
        <Route 
          path="/users" 
          element={
            <ProtectedRoute>
              <ManageUsersPage />
            </ProtectedRoute>
          } 
        />
        
        {/* Catch all - redirect to login */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
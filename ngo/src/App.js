import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { auth } from "./firebase/config"; // Add this import
import { onAuthStateChanged } from "firebase/auth"; // Add this import
import Login from "./pages/Login";
import RegisterNGO from "./pages/RegisterNGO";
import NGODashboard from "./pages/NGODashboard";
import PublicHome from "./pages/PublicHome";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userType, setUserType] = useState("");
  const [loading, setLoading] = useState(true); // Add loading state

  // Check authentication status on mount
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsLoggedIn(true);
        setUserType("ngo"); // Set as NGO user
      } else {
        setIsLoggedIn(false);
        setUserType("");
      }
      setLoading(false);
    });

    // Cleanup subscription
    return () => unsubscribe();
  }, []);

  // Handle login with user type
  const handleLogin = (type) => {
    setIsLoggedIn(true);
    setUserType(type);
  };

  // Handle logout
  const handleLogout = () => {
    auth.signOut(); // Sign out from Firebase
    setIsLoggedIn(false);
    setUserType("");
  };

  // Show loading while checking auth status
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-teal-100">
        <div className="text-center">
          <div className="spinner"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        {/* Public Home Page */}
        <Route path="/" element={<PublicHome />} />

        {/* Login Page */}
        <Route 
          path="/login" 
          element={
            isLoggedIn ? <Navigate to="/ngo-dashboard" /> : <Login onLogin={handleLogin} />
          } 
        />

        {/* Register NGO Page */}
        <Route 
          path="/register-ngo" 
          element={
            isLoggedIn ? <Navigate to="/ngo-dashboard" /> : <RegisterNGO />
          } 
        />

        {/* NGO Dashboard */}
        <Route
          path="/ngo-dashboard"
          element={
            isLoggedIn && userType === "ngo" ? (
              <NGODashboard onLogout={handleLogout} />
            ) : (
              <Navigate to="/login" />
            )
          }
        />

        {/* Catch invalid routes */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
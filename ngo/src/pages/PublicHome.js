import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, Users, Calendar, TrendingUp, ArrowRight, CheckCircle } from 'lucide-react';

function PublicHome() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-2 rounded-lg">
                <Heart className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900">NGO Helpify</h1>
            </div>
            <button
              onClick={() => navigate('/login')}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Login
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Connecting NGOs with <span className="text-blue-600">Volunteers</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Join the platform that brings together passionate volunteers and impactful NGOs to create positive change in communities.
          </p>
          <button
            onClick={() => navigate('/login')}
            className="bg-blue-600 text-white px-8 py-4 rounded-lg hover:bg-blue-700 transition-colors font-medium text-lg inline-flex items-center gap-2"
          >
            Get Started <ArrowRight className="w-5 h-5" />
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-20">
          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-blue-600" />
            </div>
            <p className="text-3xl font-bold text-gray-900 mb-2">24+</p>
            <p className="text-gray-600">Registered NGOs</p>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Heart className="w-8 h-8 text-green-600" />
            </div>
            <p className="text-3xl font-bold text-gray-900 mb-2">312+</p>
            <p className="text-gray-600">Active Volunteers</p>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Calendar className="w-8 h-8 text-orange-600" />
            </div>
            <p className="text-3xl font-bold text-gray-900 mb-2">150+</p>
            <p className="text-gray-600">Events Completed</p>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <TrendingUp className="w-8 h-8 text-purple-600" />
            </div>
            <p className="text-3xl font-bold text-gray-900 mb-2">₹10L+</p>
            <p className="text-gray-600">Donations Raised</p>
          </div>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="bg-blue-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <CheckCircle className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">For NGOs</h3>
            <p className="text-gray-600">
              Manage volunteers, organize events, track donations, and grow your impact with our comprehensive platform.
            </p>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="bg-green-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">For Volunteers</h3>
            <p className="text-gray-600">
              Discover meaningful opportunities, connect with NGOs, and make a real difference in your community.
            </p>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="bg-purple-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <CheckCircle className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Easy Management</h3>
            <p className="text-gray-600">
              Simple, intuitive interface that makes managing your NGO operations effortless and efficient.
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white mt-20">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="text-center text-gray-600">
            <p>&copy; 2025 NGO Connect. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default PublicHome;
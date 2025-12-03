import React, { useState } from 'react';
import { Menu, X, Users, Calendar, TrendingUp, Bell, Settings, LogOut, Search, Plus, Eye, Edit, Trash2, Filter, Download, Heart, MapPin } from 'lucide-react';

function AdminDashboard({ onLogout }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');

  const stats = {
    totalNGOs: 24,
    totalVolunteers: 312,
    activeEvents: 8,
    totalDonations: '₹4,50,000'
  };

  const recentActivity = [
    { id: 1, ngo: 'Hope Foundation', action: 'created a new event: Clean City Drive', time: '2 hours ago', type: 'event' },
    { id: 2, ngo: 'Helping Hands NGO', action: 'added 5 new volunteers', time: '5 hours ago', type: 'volunteer' },
    { id: 3, ngo: 'Education4All NGO', action: 'received ₹25,000 donation', time: '1 day ago', type: 'donation' },
    { id: 4, ngo: 'GreenEarth NGO', action: 'updated their profile information', time: '2 days ago', type: 'profile' }
  ];

  const ngos = [
    { id: 1, name: 'Hope Foundation', category: 'Education', volunteers: 45, events: 3, location: 'Mumbai', contact: 'contact@hope.org', status: 'active' },
    { id: 2, name: 'Helping Hands', category: 'Healthcare', volunteers: 67, events: 5, location: 'Delhi', contact: 'info@helpinghands.org', status: 'active' },
    { id: 3, name: 'Education4All', category: 'Education', volunteers: 89, events: 2, location: 'Bangalore', contact: 'admin@edu4all.org', status: 'active' },
    { id: 4, name: 'GreenEarth', category: 'Environment', volunteers: 34, events: 4, location: 'Pune', contact: 'contact@greenearth.org', status: 'active' }
  ];

  const renderDashboard = () => (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-600 mt-2">Manage NGOs, volunteers, and events in one place.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 font-medium">Total NGOs</p>
              <p className="text-3xl font-bold text-blue-600 mt-2">{stats.totalNGOs}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-lg">
              <Users className="w-8 h-8 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 font-medium">Total Volunteers</p>
              <p className="text-3xl font-bold text-green-600 mt-2">{stats.totalVolunteers}</p>
            </div>
            <div className="bg-green-100 p-3 rounded-lg">
              <Heart className="w-8 h-8 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 font-medium">Active Events</p>
              <p className="text-3xl font-bold text-orange-600 mt-2">{stats.activeEvents}</p>
            </div>
            <div className="bg-orange-100 p-3 rounded-lg">
              <Calendar className="w-8 h-8 text-orange-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 font-medium">Total Donations</p>
              <p className="text-3xl font-bold text-purple-600 mt-2">{stats.totalDonations}</p>
            </div>
            <div className="bg-purple-100 p-3 rounded-lg">
              <TrendingUp className="w-8 h-8 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-900">Recent NGO Activity</h2>
        </div>
        <div className="divide-y divide-gray-100">
          {recentActivity.map(activity => (
            <div key={activity.id} className="p-6 hover:bg-gray-50 transition-colors">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-gray-900 font-medium">
                    <span className="text-blue-600">{activity.ngo}</span> {activity.action}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">{activity.time}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  activity.type === 'event' ? 'bg-orange-100 text-orange-600' :
                  activity.type === 'volunteer' ? 'bg-green-100 text-green-600' :
                  activity.type === 'donation' ? 'bg-purple-100 text-purple-600' :
                  'bg-blue-100 text-blue-600'
                }`}>
                  {activity.type}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderNGOs = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">NGO Management</h1>
          <p className="text-gray-600 mt-2">View and manage all registered NGOs</p>
        </div>
        <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 font-medium">
          <Plus className="w-5 h-5" />
          Add NGO
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-4 border-b border-gray-100 flex items-center gap-4">
          <div className="flex-1 relative">
            <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input type="text" placeholder="Search NGOs..." className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <button className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <Filter className="w-5 h-5 text-gray-600" />
          </button>
          <button className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <Download className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">NGO Name</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Category</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Location</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Volunteers</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Events</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Status</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {ngos.map(ngo => (
                <tr key={ngo.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-medium text-gray-900">{ngo.name}</p>
                      <p className="text-sm text-gray-500">{ngo.contact}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-600">{ngo.category}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-gray-600">
                      <MapPin className="w-4 h-4" />
                      {ngo.location}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-600">{ngo.volunteers}</td>
                  <td className="px-6 py-4 text-gray-600">{ngo.events}</td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 bg-green-100 text-green-600 rounded-full text-xs font-medium">
                      {ngo.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button className="p-2 hover:bg-blue-50 rounded-lg transition-colors">
                        <Eye className="w-4 h-4 text-blue-600" />
                      </button>
                      <button className="p-2 hover:bg-green-50 rounded-lg transition-colors">
                        <Edit className="w-4 h-4 text-green-600" />
                      </button>
                      <button className="p-2 hover:bg-red-50 rounded-lg transition-colors">
                        <Trash2 className="w-4 h-4 text-red-600" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm border-b border-gray-200 fixed top-0 left-0 right-0 z-50">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
              <div className="flex items-center gap-3">
                <div className="bg-blue-600 p-2 rounded-lg">
                  <Heart className="w-6 h-6 text-white" />
                </div>
                <h1 className="text-xl font-bold text-gray-900">NGO Connect - Admin</h1>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors relative">
                <Bell className="w-6 h-6 text-gray-600" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">Admin User</p>
                  <p className="text-xs text-gray-500">admin@ngoconnect.org</p>
                </div>
                <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-semibold">A</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div className="flex pt-20">
        <aside className={`fixed left-0 top-20 bottom-0 bg-white border-r border-gray-200 transition-all duration-300 ${sidebarOpen ? 'w-64' : 'w-0'} overflow-hidden`}>
          <nav className="p-4 space-y-2">
            <button onClick={() => setActiveTab('dashboard')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'dashboard' ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50'}`}>
              <TrendingUp className="w-5 h-5" />
              <span className="font-medium">Dashboard</span>
            </button>

            <button onClick={() => setActiveTab('ngos')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'ngos' ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50'}`}>
              <Users className="w-5 h-5" />
              <span className="font-medium">NGOs</span>
            </button>

            <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors">
              <Calendar className="w-5 h-5" />
              <span className="font-medium">Events</span>
            </button>

            <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors">
              <Heart className="w-5 h-5" />
              <span className="font-medium">Volunteers</span>
            </button>

            <div className="pt-4 mt-4 border-t border-gray-200">
              <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors">
                <Settings className="w-5 h-5" />
                <span className="font-medium">Settings</span>
              </button>

              <button onClick={onLogout} className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-colors">
                <LogOut className="w-5 h-5" />
                <span className="font-medium">Logout</span>
              </button>
            </div>
          </nav>
        </aside>

        <main className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-0'}`}>
          <div className="p-8">
            {activeTab === 'dashboard' && renderDashboard()}
            {activeTab === 'ngos' && renderNGOs()}
          </div>
        </main>
      </div>
    </div>
  );
}

export default AdminDashboard;
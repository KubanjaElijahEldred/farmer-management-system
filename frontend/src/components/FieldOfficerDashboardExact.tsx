import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Search, MapPin, Edit, Users, ClipboardList, FileText, Plus, Trash2, Eye, Save, X } from 'lucide-react';
import { useWallpaper } from '../contexts/WallpaperContext';
import { useAuth } from '../contexts/AuthContext';
import WallpaperGallery from './WallpaperGallery';
import { farmerService } from '../services/farmerService';
import { reportService } from '../services/reportService';

// Farmers Section Component
const FarmersSection: React.FC<{ farmers: any[]; onRefresh: () => void }> = ({ farmers, onRefresh }) => {
  const [showModal, setShowModal] = useState(false);
  const [editingFarmer, setEditingFarmer] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: '',
    contact: '',
    address: '',
  });

  const handleAdd = () => {
    setEditingFarmer(null);
    setFormData({ name: '', contact: '', address: '' });
    setShowModal(true);
  };

  const handleEdit = (farmer: any) => {
    setEditingFarmer(farmer);
    setFormData({
      name: farmer.name || '',
      contact: farmer.contact || '',
      address: farmer.address || '',
    });
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this farmer?')) {
      try {
        await farmerService.deleteFarmer(id);
        onRefresh();
      } catch (error) {
        alert('Error deleting farmer');
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingFarmer) {
        await farmerService.updateFarmer(editingFarmer._id, formData);
      } else {
        // Create with a temporary user_id - in real app, this should be the actual user creating the farmer
        const farmerData = {
          ...formData,
          user_id: editingFarmer?.user_id || 'temp_user_id'
        };
        await farmerService.createFarmer(farmerData as any);
      }
      setShowModal(false);
      onRefresh();
    } catch (error) {
      alert('Error saving farmer');
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-2xl border border-white/20 p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">👨‍🌾 Farmers Management</h2>
          <button
            onClick={handleAdd}
            className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            <Plus className="w-5 h-5" />
            <span>Add Farmer</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Name</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Contact</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Address</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Fields</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
                <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {farmers.map((farmer) => (
                <tr key={farmer._id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium">{farmer.name}</td>
                  <td className="px-4 py-3">{farmer.contact || 'N/A'}</td>
                  <td className="px-4 py-3">{farmer.address || 'N/A'}</td>
                  <td className="px-4 py-3">{farmer.fields?.length || 0} fields</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      farmer.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                    }`}>
                      {farmer.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => handleEdit(farmer)}
                      className="text-blue-600 hover:text-blue-800 mr-3"
                      title="Edit"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(farmer._id)}
                      className="text-red-600 hover:text-red-800"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4">
            <h3 className="text-xl font-bold mb-4">{editingFarmer ? 'Edit Farmer' : 'Add New Farmer'}</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                <input
                  type="text"
                  placeholder="Enter farmer's full name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Contact</label>
                <input
                  type="tel"
                  placeholder="Phone number or email"
                  value={formData.contact}
                  onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                <textarea
                  placeholder="Full address including village and district"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500"
                  rows={3}
                />
              </div>
              <div className="flex space-x-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg flex items-center justify-center space-x-2"
                >
                  <Save className="w-4 h-4" />
                  <span>Save</span>
                </button>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 py-2 rounded-lg flex items-center justify-center space-x-2"
                >
                  <X className="w-4 h-4" />
                  <span>Cancel</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

// Assignments Section Component
const AssignmentsSection: React.FC<{ assignments: any[]; farmers: any[]; onRefresh: () => void }> = ({ assignments, farmers, onRefresh }) => {
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    farmer: '',
    task: '',
    dueDate: '',
    description: '',
  });

  return (
    <div className="space-y-6">
      <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-2xl border border-white/20 p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">📋 Task Assignments</h2>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center space-x-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            <Plus className="w-5 h-5" />
            <span>New Assignment</span>
          </button>
        </div>

        <div className="grid gap-4">
          {assignments.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <div className="text-gray-400 text-5xl mb-4">📋</div>
              <h3 className="text-gray-600 text-lg font-semibold mb-2">No Task Assignments</h3>
              <p className="text-gray-500">Create your first task assignment using the button above</p>
            </div>
          ) : (
            assignments.map((assignment) => (
              <div key={assignment.id} className="bg-gray-50 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-lg">{assignment.task}</h3>
                    <p className="text-gray-600">Farmer: {assignment.farmer}</p>
                    <p className="text-sm text-gray-500">Due: {assignment.dueDate}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm ${
                    assignment.status === 'Completed' ? 'bg-green-100 text-green-700' :
                    assignment.status === 'In Progress' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-blue-100 text-blue-700'
                  }`}>
                    {assignment.status}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4">
            <h3 className="text-xl font-bold mb-4">New Task Assignment</h3>
            <form className="space-y-4">
              <select
                value={formData.farmer}
                onChange={(e) => setFormData({ ...formData, farmer: e.target.value })}
                className="w-full border rounded-lg px-3 py-2"
                required
              >
                <option value="">Select Farmer</option>
                {farmers.map((farmer) => (
                  <option key={farmer._id} value={farmer._id}>
                    {farmer.name}
                  </option>
                ))}
              </select>
              <input
                type="text"
                placeholder="Task Title"
                value={formData.task}
                onChange={(e) => setFormData({ ...formData, task: e.target.value })}
                className="w-full border rounded-lg px-3 py-2"
                required
              />
              <input
                type="date"
                value={formData.dueDate}
                onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                className="w-full border rounded-lg px-3 py-2"
                required
              />
              <textarea
                placeholder="Description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full border rounded-lg px-3 py-2"
                rows={3}
              />
              <div className="flex space-x-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-lg"
                >
                  Create Assignment
                </button>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 py-2 rounded-lg"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

// Reports Section Component
const ReportsSection: React.FC<{ reports: any[]; onRefresh: () => void; fieldOfficerId: string }> = ({ reports, onRefresh, fieldOfficerId }) => {
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    report_type: 'field_inspection',
    title: '',
    content: '',
    status: 'pending_approval',
    sent_to: 'manager',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await reportService.createReport({
        ...formData,
        generated_by: fieldOfficerId,
        data: { content: formData.content },
      } as any);
      setShowModal(false);
      onRefresh();
      alert('Report submitted successfully!');
    } catch (error) {
      alert('Error submitting report');
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-2xl border border-white/20 p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">📄 Field Reports</h2>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center space-x-2 bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            <Plus className="w-5 h-5" />
            <span>Create Report</span>
          </button>
        </div>

        <div className="grid gap-4">
          {reports.map((report) => (
            <div key={report._id} className="bg-gray-50 rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <FileText className="w-5 h-5 text-gray-600" />
                    <h3 className="font-semibold text-lg">{report.report_type.replace('_', ' ').toUpperCase()}</h3>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">
                    Created: {new Date(report.created_at).toLocaleDateString()}
                  </p>
                  <span className={`inline-block px-3 py-1 rounded-full text-sm ${
                    report.status === 'approved' ? 'bg-green-100 text-green-700' :
                    report.status === 'rejected' ? 'bg-red-100 text-red-700' :
                    'bg-yellow-100 text-yellow-700'
                  }`}>
                    {report.status.replace('_', ' ')}
                  </span>
                </div>
                <button className="text-blue-600 hover:text-blue-800">
                  <Eye className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-bold mb-4">Create New Report</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Report Type</label>
                <select
                  value={formData.report_type}
                  onChange={(e) => setFormData({ ...formData, report_type: e.target.value })}
                  className="w-full border rounded-lg px-3 py-2"
                  required
                >
                  <option value="field_inspection">Field Inspection</option>
                  <option value="harvest_assessment">Harvest Assessment</option>
                  <option value="pest_control">Pest Control</option>
                  <option value="soil_quality">Soil Quality</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Report Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full border rounded-lg px-3 py-2"
                  placeholder="Enter report title"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Send To</label>
                <select
                  value={formData.sent_to}
                  onChange={(e) => setFormData({ ...formData, sent_to: e.target.value })}
                  className="w-full border rounded-lg px-3 py-2"
                  required
                >
                  <option value="manager">Manager</option>
                  <option value="financial_manager">Financial Manager</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Report Content</label>
                <textarea
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  className="w-full border rounded-lg px-3 py-2"
                  rows={8}
                  placeholder="Enter detailed report content..."
                  required
                />
              </div>
              <div className="flex space-x-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-yellow-600 hover:bg-yellow-700 text-white py-2 rounded-lg flex items-center justify-center space-x-2"
                >
                  <Save className="w-4 h-4" />
                  <span>Submit Report</span>
                </button>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 py-2 rounded-lg flex items-center justify-center space-x-2"
                >
                  <X className="w-4 h-4" />
                  <span>Cancel</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

const FieldOfficerDashboard: React.FC = () => {
  // Add premium CSS animations
  React.useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes float {
        0%, 100% { transform: translateY(0px); }
        50% { transform: translateY(-10px); }
      }
      @keyframes glow {
        0%, 100% { box-shadow: 0 0 20px rgba(34, 197, 94, 0.3); }
        50% { box-shadow: 0 0 30px rgba(34, 197, 94, 0.6); }
      }
      @keyframes slideInUp {
        from { opacity: 0; transform: translateY(30px); }
        to { opacity: 1; transform: translateY(0); }
      }
      .animate-float { animation: float 3s ease-in-out infinite; }
      .animate-glow { animation: glow 2s ease-in-out infinite; }
      .animate-slideInUp { animation: slideInUp 0.6s ease-out; }
      .shadow-3xl { box-shadow: 0 35px 60px -12px rgba(0, 0, 0, 0.25); }
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);
  const { currentWallpaper, setWallpaper } = useWallpaper();
  const { logout, user } = useAuth();
  const [showWallpaperGallery, setShowWallpaperGallery] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeSection, setActiveSection] = useState<'dashboard' | 'farmers' | 'assignments' | 'reports'>('dashboard');
  
  // Data state
  const [farmers, setFarmers] = useState<any[]>([]);
  const [assignments, setAssignments] = useState<any[]>([]);
  const [reports, setReports] = useState<any[]>([]);
  
  useEffect(() => {
    loadFarmers();
    loadReports();
    loadAssignments();
  }, []);
  
  const loadFarmers = async () => {
    try {
      const response = await farmerService.getAllFarmers();
      setFarmers(response.data || []);
    } catch (error) {
      console.error('Error loading farmers:', error);
    }
  };
  
  const loadReports = async () => {
    try {
      const response = await reportService.getAllReports();
      setReports(response.data || []);
    } catch (error) {
      console.error('Error loading reports:', error);
    }
  };
  
  const loadAssignments = () => {
    // TODO: Connect to real assignments API when available
    setAssignments([]);
  };

  // Crop category data - will be populated from real data
  const cropCategoryData: any[] = [];

  // Crop growth monitoring data - will be populated from real data
  const cropGrowthData: any[] = [];

  // My crops data - will be populated from real data
  const myCropsData: any[] = [];

  const handleWallpaperSelect = (wallpaper: any) => {
    setWallpaper(wallpaper);
    setShowWallpaperGallery(false);
  };

  return (
    <div className={`min-h-screen ${currentWallpaper.background} relative overflow-hidden`}>
      {/* Premium Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 via-transparent to-green-50/30 pointer-events-none"></div>
      <div className="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.4'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
      }}></div>
      {/* Premium Header */}
      <div className="bg-white/95 backdrop-blur-md shadow-xl border-b border-gray-200/50 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            {/* Left side - Logo and title */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-green-600 rounded flex items-center justify-center">
                  <span className="text-white font-bold text-sm">🌾</span>
                </div>
                <span className="text-xl font-bold text-gray-900">FARM MANAGEMENT</span>
                <span className="text-sm text-gray-500">System</span>
              </div>
            </div>
            
            {/* Right side - Weather, notifications, logout */}
            <div className="flex items-center space-x-4">
              {/* Weather widget - EXACT from your image */}
              <div className="flex items-center space-x-2 bg-yellow-100 px-3 py-2 rounded-lg">
                <span className="text-lg">☀️</span>
                <span className="text-sm font-medium">24°C</span>
                <span className="text-xs text-gray-600">Today is partly sunny day!</span>
              </div>
              
              {/* Wallpaper button */}
              <button 
                onClick={() => setShowWallpaperGallery(true)}
                className="p-2 bg-purple-100 hover:bg-purple-200 rounded-lg transition-colors"
                title="Change Wallpaper"
              >
                <span className="text-lg">🎨</span>
              </button>
              
              {/* Notifications */}
              <button className="p-2 bg-gray-100 rounded-lg relative">
                <span className="text-lg">🔔</span>
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
              </button>
              
              {/* User profile */}
              <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
              
              {/* Logout button */}
              <button 
                onClick={logout}
                className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors duration-200 font-medium shadow-lg hover:shadow-xl"
                title="Logout"
              >
                🚪 Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* EXACT Layout from your image */}
        <div className="flex gap-6">
          {/* Premium Sidebar */}
          <div className="w-64 bg-white/90 backdrop-blur-md rounded-2xl shadow-2xl border border-white/20 p-6 relative z-10">
            <nav className="space-y-2">
              <button 
                onClick={() => setActiveSection('dashboard')}
                className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                  activeSection === 'dashboard' 
                    ? 'bg-green-100 text-green-700 font-medium' 
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <span className="text-sm">📊</span>
                <span>Dashboard</span>
              </button>
              <button 
                onClick={() => setActiveSection('farmers')}
                className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                  activeSection === 'farmers' 
                    ? 'bg-blue-100 text-blue-700 font-medium' 
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Users className="w-4 h-4" />
                <span>Farmers</span>
              </button>
              <button 
                onClick={() => setActiveSection('assignments')}
                className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                  activeSection === 'assignments' 
                    ? 'bg-purple-100 text-purple-700 font-medium' 
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <ClipboardList className="w-4 h-4" />
                <span>Assignments</span>
              </button>
              <button 
                onClick={() => setActiveSection('reports')}
                className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                  activeSection === 'reports' 
                    ? 'bg-yellow-100 text-yellow-700 font-medium' 
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <FileText className="w-4 h-4" />
                <span>Reports</span>
              </button>
            </nav>
          </div>

          {/* Main Content - EXACT Layout */}
          <div className="flex-1 space-y-6">
            {activeSection === 'dashboard' && (
              <>
                {/* Premium Search Bar */}
                <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-2xl border border-white/20 p-6 relative z-10">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      placeholder="Search crop here"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Top Row - Crops Overview and Farm Image - EXACT Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Premium Crops Overview */}
              <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-2xl border border-white/20 p-8 relative z-10 hover:shadow-3xl transition-all duration-300">
                <h2 className="text-xl font-semibold mb-4">Crops Overview</h2>
                
                {/* Toggle buttons - EXACT from your image */}
                <div className="flex bg-gray-100 rounded-lg p-1 mb-6">
                  <button className="flex-1 py-2 px-4 bg-white rounded-md shadow-sm text-sm font-medium">
                    By Category
                  </button>
                  <button className="flex-1 py-2 px-4 text-sm font-medium text-gray-600">
                    By Health
                  </button>
                </div>

                {/* Pie Chart - EXACT positioning */}
                <div className="h-64 mb-4 flex justify-center">
                  <ResponsiveContainer width={200} height={200}>
                    <PieChart width={200} height={200}>
                      <Pie
                        data={cropCategoryData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        dataKey="value"
                      >
                        {cropCategoryData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                {/* Legend - EXACT from your image */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 rounded-full bg-orange-500"></div>
                      <span className="text-sm font-medium">Fruits</span>
                    </div>
                    <span className="text-sm text-gray-600">14,600</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 rounded-full bg-green-400"></div>
                      <span className="text-sm font-medium">Vegetables</span>
                    </div>
                    <span className="text-sm text-gray-600">2,700</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 rounded-full bg-green-600"></div>
                      <span className="text-sm font-medium">Grains</span>
                    </div>
                    <span className="text-sm text-gray-600">364,500</span>
                  </div>
                </div>
              </div>

              {/* Farm Image - EXACT from your image */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="relative h-64 bg-green-200 rounded-lg overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-green-300 to-green-500"></div>
                  <div className="absolute top-4 right-4 bg-white rounded-lg p-3 shadow-sm">
                    <div className="flex items-center space-x-2 mb-2">
                      <MapPin className="w-4 h-4 text-gray-600" />
                      <span className="text-sm font-medium">Malakwal Farm</span>
                      <Edit className="w-4 h-4 text-gray-400" />
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-xs">
                      <div className="text-center">
                        <div className="text-gray-600">Crop Health</div>
                        <div className="font-medium text-green-600">Good</div>
                      </div>
                      <div className="text-center">
                        <div className="text-gray-600">Sowing Date</div>
                        <div className="font-medium">Feb 21, 2024</div>
                      </div>
                      <div className="text-center">
                        <div className="text-gray-600">Harvest Date</div>
                        <div className="font-medium">Apr 25, 2024</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Row - Crop Growth Monitoring and My Crops - EXACT Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Crop Growth Monitoring - EXACT from your image */}
              <div className="lg:col-span-2 bg-white rounded-lg shadow-sm p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold">Crop Growth Monitoring</h2>
                  <div className="flex space-x-2">
                    <select className="text-sm border border-gray-300 rounded px-2 py-1">
                      <option>Crop Moisture</option>
                    </select>
                    <select className="text-sm border border-gray-300 rounded px-2 py-1">
                      <option>Select Crop</option>
                    </select>
                  </div>
                </div>

                {/* Monitoring Categories - EXACT from your image */}
                <div className="flex justify-between mb-4 text-xs">
                  <div className="text-center">
                    <div className="text-red-500 font-medium">0.3 Acres</div>
                    <div className="text-gray-600">Open Soil</div>
                  </div>
                  <div className="text-center">
                    <div className="text-orange-500 font-medium">0.7 Acres</div>
                    <div className="text-gray-600">Low</div>
                  </div>
                  <div className="text-center">
                    <div className="text-green-500 font-medium">0.5 Acres</div>
                    <div className="text-gray-600">Ideal</div>
                  </div>
                  <div className="text-center">
                    <div className="text-blue-500 font-medium">0.1 Acres</div>
                    <div className="text-gray-600">High</div>
                  </div>
                  <div className="text-center">
                    <div className="text-gray-500 font-medium">0.1 Acres</div>
                    <div className="text-gray-600">Cloud</div>
                  </div>
                </div>

                {/* Line Chart - EXACT positioning */}
                <div className="h-64" style={{ minHeight: '256px' }}>
                  <ResponsiveContainer width="100%" height={256}>
                    <LineChart data={cropGrowthData} width={400} height={256}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="openSoil" stroke="#ef4444" strokeWidth={2} />
                      <Line type="monotone" dataKey="low" stroke="#f97316" strokeWidth={2} />
                      <Line type="monotone" dataKey="ideal" stroke="#22c55e" strokeWidth={2} />
                      <Line type="monotone" dataKey="high" stroke="#3b82f6" strokeWidth={2} />
                      <Line type="monotone" dataKey="cloud" stroke="#6b7280" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* My Crops - EXACT from your image */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-semibold">My Crops</h2>
                  <button 
                    onClick={() => alert('Opening detailed crops view...')}
                    className="text-sm text-blue-600 hover:text-blue-800 hover:underline"
                  >
                    View All
                  </button>
                </div>

                <div className="space-y-4">
                  {myCropsData.map((crop, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                          <span className="text-sm">🌾</span>
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between items-center">
                            <span className="font-medium text-sm">{crop.name}</span>
                            <span className="text-xs text-gray-500">{crop.progress}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                            <div 
                              className="h-2 rounded-full" 
                              style={{ 
                                width: `${crop.progress}%`, 
                                backgroundColor: crop.color 
                              }}
                            ></div>
                          </div>
                          <p className="text-xs text-gray-600 mt-1">{crop.status}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
              </>
            )}

            {/* Farmers Section */}
            {activeSection === 'farmers' && (
              <FarmersSection 
                farmers={farmers}
                onRefresh={loadFarmers}
              />
            )}

            {/* Assignments Section */}
            {activeSection === 'assignments' && (
              <AssignmentsSection 
                assignments={assignments}
                farmers={farmers}
                onRefresh={loadAssignments}
              />
            )}

            {/* Reports Section */}
            {activeSection === 'reports' && (
              <ReportsSection 
                reports={reports}
                onRefresh={loadReports}
                fieldOfficerId={user?._id || ''}
              />
            )}
          </div>
        </div>
      </div>

      {/* Wallpaper Gallery Modal */}
      <WallpaperGallery
        isOpen={showWallpaperGallery}
        onClose={() => setShowWallpaperGallery(false)}
        onSelectWallpaper={handleWallpaperSelect}
        currentWallpaper={currentWallpaper.id}
      />
    </div>
  );
};

export default FieldOfficerDashboard;

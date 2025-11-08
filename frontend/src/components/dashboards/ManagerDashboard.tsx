import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import Sidebar from './common/Sidebar';
import StatCard from './common/StatCard';
import RealMapCard from './common/RealMapCard';
import { Users, DollarSign, FileText, Clock, Bell, TrendingUp, Activity } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';

const ManagerDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const [activeSection, setActiveSection] = useState<'field_officer' | 'financial' | 'reports' | 'history'>('field_officer');

  // Sidebar navigation items
  const sidebarItems = [
    { id: 'field_officer', label: 'Field Officer', icon: Users, color: 'bg-blue-600' },
    { id: 'financial', label: 'Financial Manager', icon: DollarSign, color: 'bg-green-600' },
    { id: 'reports', label: 'Reports', icon: FileText, color: 'bg-purple-600' },
    { id: 'history', label: 'History', icon: Clock, color: 'bg-orange-600' },
  ];

  // Mock data for map locations
  const mapLocations = [
    { id: '1', name: 'John Doe Farm', type: 'farmer' as const, lat: -13.9626, lng: 33.7741, status: 'Active' },
    { id: '2', name: 'Jane Smith Farm', type: 'farmer' as const, lat: -15.7861, lng: 35.0058, status: 'Active' },
    { id: '3', name: 'Officer Station 1', type: 'officer' as const, lat: -11.9598, lng: 34.0058, status: 'On Duty' },
    { id: '4', name: 'Officer Station 2', type: 'officer' as const, lat: -15.3875, lng: 35.3188, status: 'On Duty' },
    { id: '5', name: 'North Field', type: 'field' as const, lat: -13.2543, lng: 34.3015, status: 'Healthy' },
    { id: '6', name: 'South Field', type: 'field' as const, lat: -16.1572, lng: 33.5873, status: 'Needs Attention' },
  ];

  // Mock data for Field Officers
  const fieldOfficers = [
    { id: 1, name: 'Michael Brown', assignedFarmers: 42, completedInspections: 156, pendingInspections: 7, efficiency: 92 },
    { id: 2, name: 'Sarah Johnson', assignedFarmers: 38, completedInspections: 142, pendingInspections: 5, efficiency: 89 },
    { id: 3, name: 'David Wilson', assignedFarmers: 45, completedInspections: 168, pendingInspections: 9, efficiency: 95 },
    { id: 4, name: 'Emily Davis', assignedFarmers: 40, completedInspections: 149, pendingInspections: 6, efficiency: 91 },
  ];

  // Financial data
  const revenueData = [
    { month: 'Jan', revenue: 180000, expenses: 120000 },
    { month: 'Feb', revenue: 210000, expenses: 135000 },
    { month: 'Mar', revenue: 195000, expenses: 128000 },
    { month: 'Apr', revenue: 235000, expenses: 145000 },
    { month: 'May', revenue: 280000, expenses: 165000 },
    { month: 'Jun', revenue: 260000, expenses: 158000 },
  ];

  const paymentStats = [
    { status: 'Completed', count: 156, amount: 1449000, color: '#22c55e' },
    { status: 'Pending', count: 12, amount: 89000, color: '#eab308' },
    { status: 'Processing', count: 8, amount: 65000, color: '#3b82f6' },
  ];

  // Reports data
  const recentReports = [
    { id: 1, title: 'Monthly Harvest Report', type: 'Harvest', date: '2024-10-25', generatedBy: 'System', status: 'Completed' },
    { id: 2, title: 'Financial Summary Q3', type: 'Financial', date: '2024-10-20', generatedBy: 'Finance Team', status: 'Completed' },
    { id: 3, title: 'Field Officer Performance', type: 'Performance', date: '2024-10-18', generatedBy: 'Manager', status: 'Completed' },
    { id: 4, title: 'Farmer Satisfaction Survey', type: 'Survey', date: '2024-10-15', generatedBy: 'HR', status: 'Completed' },
  ];

  // History data
  const systemHistory = [
    { id: 1, action: 'Payment Processed', description: 'K45,000 paid to John Doe', user: 'Finance Manager', timestamp: '2024-10-23 14:30', type: 'payment' },
    { id: 2, action: 'Field Inspection', description: 'Inspection completed for North Field', user: 'Michael Brown', timestamp: '2024-10-23 10:15', type: 'inspection' },
    { id: 3, action: 'Report Generated', description: 'Monthly harvest report created', user: 'System', timestamp: '2024-10-22 16:45', type: 'report' },
    { id: 4, action: 'New Farmer Added', description: 'Robert Taylor registered', user: 'Manager', timestamp: '2024-10-22 09:20', type: 'farmer' },
    { id: 5, action: 'Payment Approved', description: 'K28,000 approved for Jane Smith', user: 'Finance Manager', timestamp: '2024-10-21 11:00', type: 'payment' },
  ];

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'payment': return 'bg-green-100 text-green-800';
      case 'inspection': return 'bg-blue-100 text-blue-800';
      case 'report': return 'bg-purple-100 text-purple-800';
      case 'farmer': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleSettings = () => {
    alert('Settings panel coming soon!');
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar
        items={sidebarItems}
        activeItem={activeSection}
        onItemClick={(id) => setActiveSection(id as any)}
        onLogout={logout}
        onSettings={handleSettings}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white shadow-sm border-b">
          <div className="px-8 py-4 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Manager Dashboard</h1>
              <p className="text-sm text-gray-600">Welcome back, {user?.name || 'Manager'}!</p>
            </div>
            <div className="flex items-center space-x-4">
              <button className="relative p-2 bg-yellow-50 hover:bg-yellow-100 rounded-lg transition-colors">
                <Bell className="w-5 h-5 text-yellow-600" />
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">
                  5
                </span>
              </button>
              <div className="flex items-center space-x-2 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg px-3 py-2">
                <div className="w-9 h-9 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold">
                    {user?.name?.charAt(0)?.toUpperCase() || 'M'}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">{user?.name || 'Manager'}</p>
                  <p className="text-xs text-gray-500">Manager</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto p-8">
          {/* Field Officer Section */}
          {activeSection === 'field_officer' && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-gray-900">Field Officer Management</h2>
              
              {/* Stats */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <StatCard
                  title="Total Officers"
                  value={fieldOfficers.length}
                  icon={Users}
                  iconColor="text-blue-600"
                  iconBgColor="bg-blue-100"
                  subtitle="Active in field"
                />
                <StatCard
                  title="Total Farmers"
                  value={fieldOfficers.reduce((sum, o) => sum + o.assignedFarmers, 0)}
                  icon={TrendingUp}
                  iconColor="text-green-600"
                  iconBgColor="bg-green-100"
                  subtitle="Assigned"
                />
                <StatCard
                  title="Inspections"
                  value={fieldOfficers.reduce((sum, o) => sum + o.completedInspections, 0)}
                  icon={Activity}
                  iconColor="text-purple-600"
                  iconBgColor="bg-purple-100"
                  subtitle="Completed"
                />
                <StatCard
                  title="Avg. Efficiency"
                  value={`${Math.round(fieldOfficers.reduce((sum, o) => sum + o.efficiency, 0) / fieldOfficers.length)}%`}
                  icon={TrendingUp}
                  iconColor="text-orange-600"
                  iconBgColor="bg-orange-100"
                />
              </div>

              {/* Map and Officers Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Real Interactive Map Card */}
                <RealMapCard title="Field Locations Map" locations={mapLocations} />

                {/* Officer List */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Field Officers</h3>
                  <div className="space-y-4">
                    {fieldOfficers.map((officer) => (
                      <div key={officer.id} className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold text-gray-900">{officer.name}</h4>
                          <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                            {officer.efficiency}% Efficiency
                          </span>
                        </div>
                        <div className="grid grid-cols-3 gap-4 text-sm">
                          <div>
                            <p className="text-gray-500">Farmers</p>
                            <p className="font-semibold text-gray-900">{officer.assignedFarmers}</p>
                          </div>
                          <div>
                            <p className="text-gray-500">Completed</p>
                            <p className="font-semibold text-gray-900">{officer.completedInspections}</p>
                          </div>
                          <div>
                            <p className="text-gray-500">Pending</p>
                            <p className="font-semibold text-gray-900">{officer.pendingInspections}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Financial Manager Section */}
          {activeSection === 'financial' && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-gray-900">Financial Overview</h2>
              
              {/* Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard
                  title="Total Revenue"
                  value="K2.34M"
                  icon={DollarSign}
                  iconColor="text-green-600"
                  iconBgColor="bg-green-100"
                  trend={{ value: "+22%", isPositive: true }}
                />
                <StatCard
                  title="Pending Payments"
                  value="K89K"
                  icon={Clock}
                  iconColor="text-yellow-600"
                  iconBgColor="bg-yellow-100"
                  subtitle="12 payments"
                />
                <StatCard
                  title="Completed"
                  value="K1.45M"
                  icon={TrendingUp}
                  iconColor="text-blue-600"
                  iconBgColor="bg-blue-100"
                  subtitle="156 payments"
                />
              </div>

              {/* Charts */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Revenue Chart */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue vs Expenses</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={revenueData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="revenue" fill="#22c55e" />
                      <Bar dataKey="expenses" fill="#ef4444" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                {/* Payment Distribution */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Distribution</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={paymentStats}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={(entry) => `${entry.status}: ${entry.count}`}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="amount"
                      >
                        {paymentStats.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Trend Line */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue Trend</h3>
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={revenueData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="revenue" stroke="#22c55e" strokeWidth={3} />
                    <Line type="monotone" dataKey="expenses" stroke="#ef4444" strokeWidth={3} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {/* Reports Section */}
          {activeSection === 'reports' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">System Reports</h2>
                <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                  Generate New Report
                </button>
              </div>
              
              <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Report Title</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Generated By</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {recentReports.map((report) => (
                        <tr key={report.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{report.title}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{report.type}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{report.date}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{report.generatedBy}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                              {report.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <button className="text-blue-600 hover:text-blue-800 font-medium mr-3">View</button>
                            <button className="text-green-600 hover:text-green-800 font-medium">Download</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* History Section */}
          {activeSection === 'history' && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-gray-900">System History</h2>
              
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="space-y-4">
                  {systemHistory.map((item) => (
                    <div key={item.id} className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                      <div className={`px-3 py-1 rounded-full text-xs font-medium ${getTypeColor(item.type)}`}>
                        {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900">{item.action}</h4>
                        <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                        <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                          <span>👤 {item.user}</span>
                          <span>🕒 {item.timestamp}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default ManagerDashboard;

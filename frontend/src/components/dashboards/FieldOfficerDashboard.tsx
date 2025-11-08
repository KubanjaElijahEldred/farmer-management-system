import React, { useState } from 'react';
import DashboardLayout from './common/DashboardLayout';
import StatCard from './common/StatCard';
import { Users, MapPin, ClipboardCheck, AlertTriangle, Search, FileText } from 'lucide-react';

const FieldOfficerDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'farmers' | 'inspections' | 'reports'>('overview');
  const [searchTerm, setSearchTerm] = useState('');

  // Mock data
  const stats = {
    totalFarmers: 48,
    activeFarmers: 42,
    pendingInspections: 7,
    completedInspections: 156,
    alertsCount: 3,
  };

  const farmers = [
    { id: 1, name: 'John Doe', location: 'Lilongwe', fields: 5, lastVisit: '2024-10-20', status: 'Active', health: 'Good' },
    { id: 2, name: 'Jane Smith', location: 'Blantyre', fields: 3, lastVisit: '2024-10-18', status: 'Active', health: 'Fair' },
    { id: 3, name: 'Bob Johnson', location: 'Mzuzu', fields: 4, lastVisit: '2024-10-15', status: 'Active', health: 'Excellent' },
    { id: 4, name: 'Alice Williams', location: 'Zomba', fields: 6, lastVisit: '2024-10-22', status: 'Active', health: 'Good' },
  ];

  const inspections = [
    { id: 1, farmer: 'John Doe', field: 'North Field', date: '2024-10-25', status: 'Scheduled', priority: 'High' },
    { id: 2, farmer: 'Jane Smith', field: 'East Field', date: '2024-10-26', status: 'Scheduled', priority: 'Medium' },
    { id: 3, farmer: 'Bob Johnson', field: 'South Field', date: '2024-10-20', status: 'Completed', priority: 'Low' },
    { id: 4, farmer: 'Alice Williams', field: 'West Field', date: '2024-10-23', status: 'Completed', priority: 'High' },
  ];

  const recentReports = [
    { id: 1, farmer: 'John Doe', type: 'Field Inspection', date: '2024-10-20', findings: 'Pest detected, treatment recommended' },
    { id: 2, farmer: 'Alice Williams', type: 'Harvest Assessment', date: '2024-10-22', findings: 'Ready for harvest in 2 weeks' },
    { id: 3, farmer: 'Bob Johnson', type: 'Soil Quality', date: '2024-10-15', findings: 'Needs fertilizer supplementation' },
  ];

  const alerts = [
    { id: 1, farmer: 'John Doe', field: 'North Field', issue: 'Pest Infestation', severity: 'High', date: '2024-10-23' },
    { id: 2, farmer: 'Jane Smith', field: 'East Field', issue: 'Low Soil Moisture', severity: 'Medium', date: '2024-10-22' },
    { id: 3, farmer: 'Bob Johnson', field: 'South Field', issue: 'Nutrient Deficiency', severity: 'Low', date: '2024-10-21' },
  ];

  const getHealthColor = (health: string) => {
    switch (health) {
      case 'Excellent': return 'text-green-600 bg-green-100';
      case 'Good': return 'text-blue-600 bg-blue-100';
      case 'Fair': return 'text-yellow-600 bg-yellow-100';
      case 'Poor': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed': return 'text-green-600 bg-green-100';
      case 'Scheduled': return 'text-blue-600 bg-blue-100';
      case 'In Progress': return 'text-yellow-600 bg-yellow-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High': return 'text-red-600 bg-red-100';
      case 'Medium': return 'text-yellow-600 bg-yellow-100';
      case 'Low': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'High': return 'text-red-600 bg-red-100';
      case 'Medium': return 'text-yellow-600 bg-yellow-100';
      case 'Low': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <DashboardLayout title="Field Officer Dashboard" role="Field Officer">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Farmers"
          value={stats.totalFarmers}
          icon={Users}
          iconColor="text-blue-600"
          iconBgColor="bg-blue-100"
          subtitle={`${stats.activeFarmers} active`}
        />
        <StatCard
          title="Pending Inspections"
          value={stats.pendingInspections}
          icon={ClipboardCheck}
          iconColor="text-yellow-600"
          iconBgColor="bg-yellow-100"
          subtitle="This week"
        />
        <StatCard
          title="Completed Inspections"
          value={stats.completedInspections}
          icon={MapPin}
          iconColor="text-green-600"
          iconBgColor="bg-green-100"
          trend={{ value: "+12%", isPositive: true }}
        />
        <StatCard
          title="Active Alerts"
          value={stats.alertsCount}
          icon={AlertTriangle}
          iconColor="text-red-600"
          iconBgColor="bg-red-100"
          subtitle="Requires attention"
        />
      </div>

      {/* Tabs */}
      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {(['overview', 'farmers', 'inspections', 'reports'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`${
                  activeTab === tab
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm capitalize`}
              >
                {tab}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Alerts Section */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <AlertTriangle className="w-5 h-5 mr-2 text-red-600" />
                Active Alerts
              </h3>
              <div className="space-y-3">
                {alerts.map((alert) => (
                  <div key={alert.id} className="flex items-start justify-between py-3 border-b last:border-0">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{alert.farmer} - {alert.field}</p>
                      <p className="text-xs text-gray-600 mt-1">{alert.issue}</p>
                      <p className="text-xs text-gray-500 mt-1">{alert.date}</p>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSeverityColor(alert.severity)}`}>
                      {alert.severity}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Upcoming Inspections */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <ClipboardCheck className="w-5 h-5 mr-2 text-blue-600" />
                Upcoming Inspections
              </h3>
              <div className="space-y-3">
                {inspections.filter(i => i.status === 'Scheduled').map((inspection) => (
                  <div key={inspection.id} className="flex items-start justify-between py-3 border-b last:border-0">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{inspection.farmer}</p>
                      <p className="text-xs text-gray-600 mt-1">{inspection.field}</p>
                      <p className="text-xs text-gray-500 mt-1">{inspection.date}</p>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(inspection.priority)}`}>
                      {inspection.priority}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Farmers Tab */}
      {activeTab === 'farmers' && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6 border-b">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Assigned Farmers</h3>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search farmers..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Farmer</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fields</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Visit</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Health</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {farmers.map((farmer) => (
                  <tr key={farmer.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{farmer.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{farmer.location}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{farmer.fields}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{farmer.lastVisit}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getHealthColor(farmer.health)}`}>
                        {farmer.health}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <button className="text-blue-600 hover:text-blue-800 font-medium">View Details</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Inspections Tab */}
      {activeTab === 'inspections' && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6 border-b">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Field Inspections</h3>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                Schedule Inspection
              </button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Farmer</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Field</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Priority</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {inspections.map((inspection) => (
                  <tr key={inspection.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{inspection.farmer}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{inspection.field}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{inspection.date}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getPriorityColor(inspection.priority)}`}>
                        {inspection.priority}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(inspection.status)}`}>
                        {inspection.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <button className="text-blue-600 hover:text-blue-800 font-medium">
                        {inspection.status === 'Scheduled' ? 'Start' : 'View'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Reports Tab */}
      {activeTab === 'reports' && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6 border-b">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Inspection Reports</h3>
              <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                Create Report
              </button>
            </div>
          </div>
          <div className="divide-y">
            {recentReports.map((report) => (
              <div key={report.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <FileText className="w-4 h-4 text-blue-600" />
                      <h4 className="text-base font-semibold text-gray-900">{report.type}</h4>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">Farmer: {report.farmer}</p>
                    <p className="text-sm text-gray-700">{report.findings}</p>
                  </div>
                  <span className="text-xs text-gray-500">{report.date}</span>
                </div>
                <button className="text-sm text-blue-600 hover:text-blue-800 font-medium mt-2">
                  View Full Report →
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default FieldOfficerDashboard;

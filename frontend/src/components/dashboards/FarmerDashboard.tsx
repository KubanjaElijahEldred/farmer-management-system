import React, { useState } from 'react';
import DashboardLayout from './common/DashboardLayout';
import StatCard from './common/StatCard';
import { Sprout, MapPin, TrendingUp, DollarSign, Activity, AlertCircle } from 'lucide-react';

const FarmerDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'fields' | 'harvests' | 'payments'>('overview');

  // Mock data - Replace with actual API calls
  const stats = {
    totalFields: 5,
    activeFields: 4,
    totalHarvests: 12,
    pendingPayments: 3,
    totalEarnings: 45000,
    recentPayment: 5200
  };

  const myFields = [
    { id: 1, name: 'North Field', crop: 'Maize', size: '2.5 acres', status: 'Growing', health: 'Good', progress: 65 },
    { id: 2, name: 'South Field', crop: 'Wheat', size: '3.0 acres', status: 'Flowering', health: 'Excellent', progress: 80 },
    { id: 3, name: 'East Field', crop: 'Beans', size: '1.5 acres', status: 'Growing', health: 'Fair', progress: 45 },
    { id: 4, name: 'West Field', crop: 'Soybeans', size: '2.0 acres', status: 'Ripening', health: 'Good', progress: 90 },
  ];

  const recentHarvests = [
    { id: 1, crop: 'Maize', quantity: '1200 kg', date: '2024-10-15', value: 8400, status: 'Sold' },
    { id: 2, crop: 'Wheat', quantity: '800 kg', date: '2024-10-10', value: 5200, status: 'Pending Payment' },
    { id: 3, crop: 'Beans', quantity: '500 kg', date: '2024-10-05', value: 4000, status: 'Sold' },
  ];

  const payments = [
    { id: 1, harvest: 'Maize - North Field', amount: 8400, date: '2024-10-16', status: 'Completed' },
    { id: 2, harvest: 'Wheat - South Field', amount: 5200, date: '2024-10-12', status: 'Pending' },
    { id: 3, harvest: 'Beans - East Field', amount: 4000, date: '2024-10-08', status: 'Completed' },
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
      case 'Sold': return 'text-green-600 bg-green-100';
      case 'Pending': return 'text-yellow-600 bg-yellow-100';
      case 'Pending Payment': return 'text-yellow-600 bg-yellow-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <DashboardLayout title="Farmer Dashboard" role="Farmer">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Fields"
          value={stats.totalFields}
          icon={MapPin}
          iconColor="text-green-600"
          iconBgColor="bg-green-100"
          subtitle={`${stats.activeFields} active`}
        />
        <StatCard
          title="Total Harvests"
          value={stats.totalHarvests}
          icon={Sprout}
          iconColor="text-blue-600"
          iconBgColor="bg-blue-100"
          trend={{ value: "+15%", isPositive: true }}
        />
        <StatCard
          title="Total Earnings"
          value={`K${stats.totalEarnings.toLocaleString()}`}
          icon={DollarSign}
          iconColor="text-purple-600"
          iconBgColor="bg-purple-100"
          trend={{ value: "+8%", isPositive: true }}
        />
        <StatCard
          title="Pending Payments"
          value={stats.pendingPayments}
          icon={AlertCircle}
          iconColor="text-yellow-600"
          iconBgColor="bg-yellow-100"
          subtitle="Awaiting processing"
        />
      </div>

      {/* Tabs */}
      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {(['overview', 'fields', 'harvests', 'payments'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`${
                  activeTab === tab
                    ? 'border-green-500 text-green-600'
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
          {/* Quick Stats */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Activity */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Activity className="w-5 h-5 mr-2 text-blue-600" />
                Recent Activity
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between py-2 border-b">
                  <div>
                    <p className="text-sm font-medium text-gray-900">Harvest Completed</p>
                    <p className="text-xs text-gray-500">North Field - Maize, 1200 kg</p>
                  </div>
                  <span className="text-xs text-gray-500">2 days ago</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b">
                  <div>
                    <p className="text-sm font-medium text-gray-900">Payment Received</p>
                    <p className="text-xs text-gray-500">K8,400 for Maize harvest</p>
                  </div>
                  <span className="text-xs text-gray-500">3 days ago</span>
                </div>
                <div className="flex items-center justify-between py-2">
                  <div>
                    <p className="text-sm font-medium text-gray-900">Field Inspection</p>
                    <p className="text-xs text-gray-500">South Field - Status: Good</p>
                  </div>
                  <span className="text-xs text-gray-500">5 days ago</span>
                </div>
              </div>
            </div>

            {/* Upcoming Tasks */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <TrendingUp className="w-5 h-5 mr-2 text-green-600" />
                Upcoming Tasks
              </h3>
              <div className="space-y-3">
                <div className="flex items-start space-x-3 py-2 border-b">
                  <input type="checkbox" className="mt-1" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">Fertilizer Application</p>
                    <p className="text-xs text-gray-500">West Field - Due in 3 days</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3 py-2 border-b">
                  <input type="checkbox" className="mt-1" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">Pest Inspection</p>
                    <p className="text-xs text-gray-500">All Fields - Due in 5 days</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3 py-2">
                  <input type="checkbox" className="mt-1" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">Harvest Preparation</p>
                    <p className="text-xs text-gray-500">South Field - Due in 1 week</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Fields Tab */}
      {activeTab === 'fields' && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6 border-b">
            <h3 className="text-lg font-semibold text-gray-900">My Fields</h3>
          </div>
          <div className="divide-y">
            {myFields.map((field) => (
              <div key={field.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h4 className="text-base font-semibold text-gray-900">{field.name}</h4>
                    <p className="text-sm text-gray-600">{field.crop} • {field.size}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getHealthColor(field.health)}`}>
                    {field.health}
                  </span>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Growth Progress</span>
                    <span className="font-medium text-gray-900">{field.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-green-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${field.progress}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Harvests Tab */}
      {activeTab === 'harvests' && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6 border-b">
            <h3 className="text-lg font-semibold text-gray-900">Recent Harvests</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Crop</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Value</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {recentHarvests.map((harvest) => (
                  <tr key={harvest.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{harvest.crop}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{harvest.quantity}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{harvest.date}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">K{harvest.value.toLocaleString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(harvest.status)}`}>
                        {harvest.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Payments Tab */}
      {activeTab === 'payments' && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6 border-b">
            <h3 className="text-lg font-semibold text-gray-900">Payment History</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Harvest</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {payments.map((payment) => (
                  <tr key={payment.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{payment.harvest}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-green-600">K{payment.amount.toLocaleString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{payment.date}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(payment.status)}`}>
                        {payment.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default FarmerDashboard;

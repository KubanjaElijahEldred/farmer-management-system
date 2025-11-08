import React, { useState } from 'react';
import DashboardLayout from './common/DashboardLayout';
import StatCard from './common/StatCard';
import { DollarSign, TrendingUp, CreditCard, AlertCircle, Download } from 'lucide-react';

const FinanceDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'payments' | 'transactions' | 'reports'>('overview');
  const [filterPeriod, setFilterPeriod] = useState('month');

  // Mock data
  const stats = {
    totalPayments: 234000,
    pendingPayments: 45600,
    completedPayments: 188400,
    pendingCount: 12,
    completedCount: 156,
  };

  const recentPayments = [
    { id: 1, farmer: 'John Doe', harvest: 'Maize', amount: 8400, date: '2024-10-23', status: 'Completed', method: 'Mobile Money' },
    { id: 2, farmer: 'Jane Smith', harvest: 'Wheat', amount: 5200, date: '2024-10-22', status: 'Pending', method: 'Bank Transfer' },
    { id: 3, farmer: 'Bob Johnson', harvest: 'Beans', amount: 4000, date: '2024-10-21', status: 'Completed', method: 'Mobile Money' },
    { id: 4, farmer: 'Alice Williams', harvest: 'Soybeans', amount: 6800, date: '2024-10-20', status: 'Processing', method: 'Cash' },
    { id: 5, farmer: 'Charlie Brown', harvest: 'Maize', amount: 9200, date: '2024-10-19', status: 'Completed', method: 'Bank Transfer' },
  ];

  const transactions = [
    { id: 1, type: 'Payment Out', description: 'Farmer Payment - Maize Harvest', amount: -8400, date: '2024-10-23', category: 'Harvest' },
    { id: 2, type: 'Payment Out', description: 'Farmer Payment - Wheat Harvest', amount: -5200, date: '2024-10-22', category: 'Harvest' },
    { id: 3, type: 'Payment In', description: 'Buyer Payment - Maize Bulk', amount: 45000, date: '2024-10-21', category: 'Sale' },
    { id: 4, type: 'Payment Out', description: 'Operational Costs', amount: -2500, date: '2024-10-20', category: 'Operations' },
  ];

  const pendingApprovals = [
    { id: 1, farmer: 'Jane Smith', harvest: 'Wheat - South Field', amount: 5200, submitted: '2024-10-22', priority: 'High' },
    { id: 2, farmer: 'Alice Williams', harvest: 'Soybeans - West Field', amount: 6800, submitted: '2024-10-20', priority: 'Medium' },
    { id: 3, farmer: 'David Miller', harvest: 'Beans - North Field', amount: 3400, submitted: '2024-10-19', priority: 'Low' },
  ];

  const monthlyData = [
    { month: 'Jan', paid: 45000, pending: 8000 },
    { month: 'Feb', paid: 52000, pending: 6000 },
    { month: 'Mar', paid: 48000, pending: 9000 },
    { month: 'Apr', paid: 55000, pending: 7500 },
    { month: 'May', paid: 61000, pending: 5000 },
    { month: 'Jun', paid: 58000, pending: 12000 },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed': return 'text-green-600 bg-green-100';
      case 'Pending': return 'text-yellow-600 bg-yellow-100';
      case 'Processing': return 'text-blue-600 bg-blue-100';
      case 'Failed': return 'text-red-600 bg-red-100';
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

  return (
    <DashboardLayout title="Finance Dashboard" role="Finance Manager">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Payments"
          value={`K${stats.totalPayments.toLocaleString()}`}
          icon={DollarSign}
          iconColor="text-green-600"
          iconBgColor="bg-green-100"
          trend={{ value: "+12%", isPositive: true }}
        />
        <StatCard
          title="Pending Payments"
          value={`K${stats.pendingPayments.toLocaleString()}`}
          icon={AlertCircle}
          iconColor="text-yellow-600"
          iconBgColor="bg-yellow-100"
          subtitle={`${stats.pendingCount} payments`}
        />
        <StatCard
          title="Completed Payments"
          value={`K${stats.completedPayments.toLocaleString()}`}
          icon={CreditCard}
          iconColor="text-blue-600"
          iconBgColor="bg-blue-100"
          subtitle={`${stats.completedCount} payments`}
        />
        <StatCard
          title="Processing"
          value="K12,800"
          icon={TrendingUp}
          iconColor="text-purple-600"
          iconBgColor="bg-purple-100"
          subtitle="In progress"
        />
      </div>

      {/* Tabs */}
      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {(['overview', 'payments', 'transactions', 'reports'] as const).map((tab) => (
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
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Pending Approvals */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <AlertCircle className="w-5 h-5 mr-2 text-yellow-600" />
                Pending Approvals
              </h3>
              <div className="space-y-3">
                {pendingApprovals.map((payment) => (
                  <div key={payment.id} className="flex items-start justify-between py-3 border-b last:border-0">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{payment.farmer}</p>
                      <p className="text-xs text-gray-600 mt-1">{payment.harvest}</p>
                      <p className="text-sm font-bold text-green-600 mt-1">K{payment.amount.toLocaleString()}</p>
                      <p className="text-xs text-gray-500 mt-1">Submitted: {payment.submitted}</p>
                    </div>
                    <div className="flex flex-col items-end space-y-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(payment.priority)}`}>
                        {payment.priority}
                      </span>
                      <div className="flex space-x-2">
                        <button className="text-xs text-green-600 hover:text-green-800 font-medium">Approve</button>
                        <button className="text-xs text-red-600 hover:text-red-800 font-medium">Reject</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Transactions */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <TrendingUp className="w-5 h-5 mr-2 text-blue-600" />
                Recent Transactions
              </h3>
              <div className="space-y-3">
                {transactions.slice(0, 4).map((transaction) => (
                  <div key={transaction.id} className="flex items-start justify-between py-3 border-b last:border-0">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{transaction.description}</p>
                      <p className="text-xs text-gray-500 mt-1">{transaction.date}</p>
                    </div>
                    <div className="text-right">
                      <p className={`text-sm font-bold ${transaction.amount > 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {transaction.amount > 0 ? '+' : ''}K{Math.abs(transaction.amount).toLocaleString()}
                      </p>
                      <span className="text-xs text-gray-500">{transaction.category}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Payment Summary Chart */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Payment Summary</h3>
              <select
                value={filterPeriod}
                onChange={(e) => setFilterPeriod(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="week">This Week</option>
                <option value="month">This Month</option>
                <option value="year">This Year</option>
              </select>
            </div>
            <div className="grid grid-cols-6 gap-4">
              {monthlyData.map((data) => (
                <div key={data.month} className="text-center">
                  <div className="flex flex-col items-center space-y-1">
                    <div className="w-full bg-gray-200 rounded-t" style={{ height: `${(data.paid / 1000)}px` }}>
                      <div className="w-full bg-green-500 rounded-t" style={{ height: `${(data.paid / 1000)}px` }}></div>
                    </div>
                    <div className="w-full bg-yellow-500 rounded" style={{ height: `${(data.pending / 1000)}px` }}></div>
                  </div>
                  <p className="text-xs text-gray-600 mt-2">{data.month}</p>
                </div>
              ))}
            </div>
            <div className="flex justify-center space-x-6 mt-6">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                <span className="text-sm text-gray-600">Paid</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div>
                <span className="text-sm text-gray-600">Pending</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Payments Tab */}
      {activeTab === 'payments' && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6 border-b">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">All Payments</h3>
              <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center">
                <Download className="w-4 h-4 mr-2" />
                Export Report
              </button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Farmer</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Harvest</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Method</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {recentPayments.map((payment) => (
                  <tr key={payment.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{payment.farmer}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{payment.harvest}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-green-600">K{payment.amount.toLocaleString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{payment.date}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{payment.method}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(payment.status)}`}>
                        {payment.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <button className="text-blue-600 hover:text-blue-800 font-medium">View</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Transactions Tab */}
      {activeTab === 'transactions' && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6 border-b">
            <h3 className="text-lg font-semibold text-gray-900">All Transactions</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {transactions.map((transaction) => (
                  <tr key={transaction.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{transaction.type}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{transaction.description}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{transaction.category}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold">
                      <span className={transaction.amount > 0 ? 'text-green-600' : 'text-red-600'}>
                        {transaction.amount > 0 ? '+' : ''}K{Math.abs(transaction.amount).toLocaleString()}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{transaction.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Reports Tab */}
      {activeTab === 'reports' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Monthly Report</h3>
              <Download className="w-5 h-5 text-gray-400" />
            </div>
            <p className="text-sm text-gray-600 mb-4">Complete financial summary for the month</p>
            <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              Generate Report
            </button>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Payment Report</h3>
              <Download className="w-5 h-5 text-gray-400" />
            </div>
            <p className="text-sm text-gray-600 mb-4">Detailed payment transactions and status</p>
            <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              Generate Report
            </button>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Annual Report</h3>
              <Download className="w-5 h-5 text-gray-400" />
            </div>
            <p className="text-sm text-gray-600 mb-4">Year-end financial summary</p>
            <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              Generate Report
            </button>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default FinanceDashboard;

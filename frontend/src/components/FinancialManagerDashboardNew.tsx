import React from 'react';
import { BarChart, Bar, PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { DollarSign, TrendingUp, TrendingDown, CreditCard, AlertTriangle, PieChart as PieChartIcon } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const FinancialManagerDashboard: React.FC = () => {
  const { logout } = useAuth();
  // Financial KPIs data
  const financialKPIs = [
    { title: 'Total Revenue', value: '$2.4M', change: '+12.5%', trend: 'up', icon: DollarSign },
    { title: 'Net Profit', value: '$680K', change: '+8.2%', trend: 'up', icon: TrendingUp },
    { title: 'Operating Costs', value: '$1.72M', change: '-3.1%', trend: 'down', icon: TrendingDown },
    { title: 'Cash Flow', value: '$420K', change: '+15.7%', trend: 'up', icon: CreditCard }
  ];

  // Revenue and profit trends data
  const revenueData = [
    { month: 'Jan', revenue: 180000, profit: 45000, expenses: 135000 },
    { month: 'Feb', revenue: 195000, profit: 52000, expenses: 143000 },
    { month: 'Mar', revenue: 210000, profit: 58000, expenses: 152000 },
    { month: 'Apr', revenue: 225000, profit: 65000, expenses: 160000 },
    { month: 'May', revenue: 240000, profit: 72000, expenses: 168000 },
    { month: 'Jun', revenue: 255000, profit: 78000, expenses: 177000 },
    { month: 'Jul', revenue: 270000, profit: 85000, expenses: 185000 },
    { month: 'Aug', revenue: 285000, profit: 92000, expenses: 193000 },
    { month: 'Sep', revenue: 300000, profit: 98000, expenses: 202000 },
    { month: 'Oct', revenue: 315000, profit: 105000, expenses: 210000 },
    { month: 'Nov', revenue: 330000, profit: 112000, expenses: 218000 },
    { month: 'Dec', revenue: 345000, profit: 118000, expenses: 227000 }
  ];

  // Budget allocation data
  const budgetData = [
    { category: 'Seeds & Fertilizers', allocated: 450000, spent: 420000, percentage: 93 },
    { category: 'Equipment', allocated: 300000, spent: 285000, percentage: 95 },
    { category: 'Labor', allocated: 600000, spent: 580000, percentage: 97 },
    { category: 'Utilities', allocated: 150000, spent: 135000, percentage: 90 },
    { category: 'Maintenance', allocated: 200000, spent: 175000, percentage: 88 }
  ];

  // Payment status data
  const paymentStatusData = [
    { name: 'Completed', value: 65, color: '#22c55e', amount: 1560000 },
    { name: 'Pending', value: 25, color: '#f59e0b', amount: 600000 },
    { name: 'Overdue', value: 10, color: '#ef4444', amount: 240000 }
  ];

  // ROI by crop data
  const roiData = [
    { crop: 'Wheat', roi: 18.5, investment: 250000, returns: 296250 },
    { crop: 'Corn', roi: 22.3, investment: 180000, returns: 220140 },
    { crop: 'Rice', roi: 15.8, investment: 200000, returns: 231600 },
    { crop: 'Soybeans', roi: 20.1, investment: 150000, returns: 180150 },
    { crop: 'Vegetables', roi: 25.7, investment: 120000, returns: 150840 }
  ];

  // Financial alerts
  const financialAlerts = [
    { id: 1, type: 'warning', message: 'Equipment budget 95% utilized', priority: 'medium' },
    { id: 2, type: 'danger', message: '10 overdue payments totaling $240K', priority: 'high' },
    { id: 3, type: 'info', message: 'Q4 profit target 85% achieved', priority: 'low' },
    { id: 4, type: 'warning', message: 'Utility costs increased by 12%', priority: 'medium' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-green-600 rounded flex items-center justify-center">
                  <span className="text-white font-bold text-sm">🌾</span>
                </div>
                <span className="text-xl font-bold text-gray-900">FARM MANAGEMENT</span>
                <span className="text-sm text-gray-500">System</span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-gray-900">Financial Dashboard</h1>
              <button className="p-2 bg-gray-100 rounded-lg">
                <span className="text-lg">🔔</span>
              </button>
              <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
              {/* Logout Button */}
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
        {/* Financial KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {financialKPIs.map((kpi, index) => (
            <div key={index} className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">{kpi.title}</p>
                  <p className="text-3xl font-bold text-gray-900">{kpi.value}</p>
                  <div className="flex items-center mt-2">
                    {kpi.trend === 'up' ? (
                      <TrendingUp className="w-4 h-4 text-green-600 mr-1" />
                    ) : (
                      <TrendingDown className="w-4 h-4 text-red-600 mr-1" />
                    )}
                    <p className={`text-sm ${kpi.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                      {kpi.change}
                    </p>
                  </div>
                </div>
                <div className="p-3 bg-gray-100 rounded-lg">
                  <kpi.icon className="w-6 h-6 text-gray-600" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Revenue Trends and Budget */}
          <div className="lg:col-span-2 space-y-8">
            {/* Revenue and Profit Trends */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">Revenue & Profit Trends</h2>
                <select className="text-sm border border-gray-300 rounded px-3 py-1">
                  <option>Last 12 Months</option>
                  <option>Last 6 Months</option>
                  <option>Last 3 Months</option>
                </select>
              </div>
              
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={revenueData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`$${value.toLocaleString()}`, '']} />
                    <Line 
                      type="monotone" 
                      dataKey="revenue" 
                      stroke="#3b82f6" 
                      strokeWidth={3}
                      name="Revenue"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="profit" 
                      stroke="#22c55e" 
                      strokeWidth={3}
                      name="Profit"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="expenses" 
                      stroke="#ef4444" 
                      strokeWidth={3}
                      name="Expenses"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <div className="flex justify-center space-x-6 mt-4">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                  <span className="text-sm">Revenue</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  <span className="text-sm">Profit</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <span className="text-sm">Expenses</span>
                </div>
              </div>
            </div>

            {/* Budget Allocation */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-6">Budget Allocation</h2>
              
              <div className="space-y-6">
                {budgetData.map((item, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-700">{item.category}</span>
                      <div className="text-right">
                        <span className="text-sm font-bold text-gray-900">
                          ${item.spent.toLocaleString()} / ${item.allocated.toLocaleString()}
                        </span>
                        <div className="text-xs text-gray-500">{item.percentage}% utilized</div>
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className={`h-3 rounded-full transition-all duration-300 ${
                          item.percentage >= 95 ? 'bg-red-500' :
                          item.percentage >= 90 ? 'bg-yellow-500' : 'bg-green-500'
                        }`}
                        style={{ width: `${item.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* ROI by Crop */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-6">ROI by Crop Type</h2>
              
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={roiData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="crop" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`${value}%`, 'ROI']} />
                    <Bar dataKey="roi" fill="#22c55e" name="ROI %" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Right Column - Payment Status and Alerts */}
          <div className="space-y-8">
            {/* Payment Status */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-6">Payment Status</h2>
              
              <div className="h-48 mb-6">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={paymentStatusData}
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={70}
                      dataKey="value"
                    >
                      {paymentStatusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="space-y-3">
                {paymentStatusData.map((item, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: item.color }}
                      ></div>
                      <span className="text-sm font-medium">{item.name}</span>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-bold text-gray-900">{item.value}%</div>
                      <div className="text-xs text-gray-500">${item.amount.toLocaleString()}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Financial Alerts */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">Financial Alerts</h2>
                <button className="text-sm text-blue-600 hover:text-blue-800">View All</button>
              </div>

              <div className="space-y-4">
                {financialAlerts.map((alert) => (
                  <div
                    key={alert.id}
                    className={`p-4 rounded-lg border-l-4 ${
                      alert.type === 'danger' ? 'bg-red-50 border-red-500' :
                      alert.type === 'warning' ? 'bg-yellow-50 border-yellow-500' :
                      'bg-blue-50 border-blue-500'
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      <AlertTriangle className={`w-5 h-5 mt-0.5 ${
                        alert.type === 'danger' ? 'text-red-500' :
                        alert.type === 'warning' ? 'text-yellow-500' :
                        'text-blue-500'
                      }`} />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">{alert.message}</p>
                        <p className={`text-xs mt-1 ${
                          alert.priority === 'high' ? 'text-red-600' :
                          alert.priority === 'medium' ? 'text-yellow-600' :
                          'text-blue-600'
                        }`}>
                          Priority: {alert.priority}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Financial Actions */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-6">Quick Actions</h2>
              <div className="space-y-3">
                <button className="w-full p-3 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors text-left">
                  <div className="flex items-center space-x-3">
                    <DollarSign className="w-5 h-5" />
                    <span className="font-medium">Generate Invoice</span>
                  </div>
                </button>
                <button className="w-full p-3 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors text-left">
                  <div className="flex items-center space-x-3">
                    <PieChartIcon className="w-5 h-5" />
                    <span className="font-medium">Financial Report</span>
                  </div>
                </button>
                <button className="w-full p-3 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors text-left">
                  <div className="flex items-center space-x-3">
                    <CreditCard className="w-5 h-5" />
                    <span className="font-medium">Process Payments</span>
                  </div>
                </button>
                <button className="w-full p-3 bg-orange-100 text-orange-700 rounded-lg hover:bg-orange-200 transition-colors text-left">
                  <div className="flex items-center space-x-3">
                    <TrendingUp className="w-5 h-5" />
                    <span className="font-medium">Budget Planning</span>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinancialManagerDashboard;

import React from 'react';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { MapPin, TrendingUp, Users, DollarSign, Truck, Package } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const ManagerDashboard: React.FC = () => {
  const { logout } = useAuth();
  // Farm locations data for map visualization
  const farmLocations = [
    { id: 1, name: 'North Farm', lat: 33.6844, lng: 73.0479, status: 'active', crops: 'Wheat, Corn' },
    { id: 2, name: 'South Farm', lat: 33.5651, lng: 73.0169, status: 'active', crops: 'Rice, Barley' },
    { id: 3, name: 'East Farm', lat: 33.6073, lng: 73.1389, status: 'maintenance', crops: 'Vegetables' },
    { id: 4, name: 'West Farm', lat: 33.6518, lng: 72.9610, status: 'active', crops: 'Fruits' }
  ];

  // Performance metrics data
  const performanceData = [
    { metric: 'Crop Yield', value: 85, color: '#22c55e' },
    { metric: 'Efficiency', value: 92, color: '#3b82f6' },
    { metric: 'Quality Score', value: 78, color: '#f59e0b' },
    { metric: 'Sustainability', value: 88, color: '#10b981' }
  ];

  // Revenue analytics data
  const revenueData = [
    { month: 'Jan', revenue: 45000, profit: 12000 },
    { month: 'Feb', revenue: 52000, profit: 15000 },
    { month: 'Mar', revenue: 48000, profit: 13500 },
    { month: 'Apr', revenue: 61000, profit: 18000 },
    { month: 'May', revenue: 55000, profit: 16500 },
    { month: 'Jun', revenue: 67000, profit: 20000 },
    { month: 'Jul', revenue: 58000, profit: 17500 },
    { month: 'Aug', revenue: 72000, profit: 22000 },
    { month: 'Sep', revenue: 65000, profit: 19500 },
    { month: 'Oct', revenue: 69000, profit: 21000 },
    { month: 'Nov', revenue: 63000, profit: 18500 },
    { month: 'Dec', revenue: 75000, profit: 23000 }
  ];

  // Crop distribution data
  const cropDistributionData = [
    { name: 'Wheat', value: 35, color: '#f59e0b', acres: 1200 },
    { name: 'Corn', value: 25, color: '#22c55e', acres: 850 },
    { name: 'Rice', value: 20, color: '#3b82f6', acres: 680 },
    { name: 'Vegetables', value: 12, color: '#ef4444', acres: 410 },
    { name: 'Fruits', value: 8, color: '#8b5cf6', acres: 270 }
  ];

  // Recent activities data
  const recentActivities = [
    { id: 1, activity: 'Harvest completed at North Farm', time: '2 hours ago', type: 'harvest' },
    { id: 2, activity: 'New irrigation system installed', time: '4 hours ago', type: 'maintenance' },
    { id: 3, activity: 'Quality inspection passed', time: '6 hours ago', type: 'inspection' },
    { id: 4, activity: 'Fertilizer application scheduled', time: '8 hours ago', type: 'treatment' },
    { id: 5, activity: 'Equipment maintenance completed', time: '1 day ago', type: 'maintenance' }
  ];

  // Key metrics for cards
  const keyMetrics = [
    { title: 'Total Revenue', value: '$742K', change: '+12.5%', icon: DollarSign, color: 'text-green-600' },
    { title: 'Active Farms', value: '24', change: '+2', icon: MapPin, color: 'text-blue-600' },
    { title: 'Total Workers', value: '156', change: '+8', icon: Users, color: 'text-purple-600' },
    { title: 'Equipment', value: '89', change: '+3', icon: Truck, color: 'text-orange-600' }
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
                <span className="text-xl font-bold text-gray-900">AGRO</span>
                <span className="text-sm text-gray-500">FARM MANAGEMENT</span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-gray-900">Manager Dashboard</h1>
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
        {/* Top Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {keyMetrics.map((metric, index) => (
            <div key={index} className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">{metric.title}</p>
                  <p className="text-3xl font-bold text-gray-900">{metric.value}</p>
                  <p className={`text-sm ${metric.color} mt-1`}>{metric.change} from last month</p>
                </div>
                <div className={`p-3 rounded-lg bg-gray-100`}>
                  <metric.icon className={`w-6 h-6 ${metric.color}`} />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Map and Performance */}
          <div className="lg:col-span-2 space-y-8">
            {/* Farm Locations Map */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">Farm Locations</h2>
                <button className="text-sm text-blue-600 hover:text-blue-800">View All Farms</button>
              </div>
              
              {/* Map Placeholder with Farm Locations */}
              <div className="relative h-80 bg-green-50 rounded-lg overflow-hidden border-2 border-green-100">
                <div className="absolute inset-0 bg-gradient-to-br from-green-100 to-green-200"></div>
                
                {/* Farm Location Markers */}
                {farmLocations.map((farm, index) => (
                  <div
                    key={farm.id}
                    className={`absolute w-4 h-4 rounded-full ${
                      farm.status === 'active' ? 'bg-green-500' : 'bg-orange-500'
                    } border-2 border-white shadow-lg`}
                    style={{
                      left: `${20 + index * 15}%`,
                      top: `${30 + index * 10}%`
                    }}
                    title={farm.name}
                  ></div>
                ))}
                
                {/* Map Legend */}
                <div className="absolute bottom-4 left-4 bg-white rounded-lg p-3 shadow-md">
                  <div className="space-y-2 text-xs">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span>Active Farms</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                      <span>Maintenance</span>
                    </div>
                  </div>
                </div>
                
                {/* Farm Info Card */}
                <div className="absolute top-4 right-4 bg-white rounded-lg p-4 shadow-md max-w-xs">
                  <h3 className="font-semibold text-sm mb-2">North Farm</h3>
                  <div className="space-y-1 text-xs text-gray-600">
                    <p>Status: <span className="text-green-600 font-medium">Active</span></p>
                    <p>Crops: Wheat, Corn</p>
                    <p>Area: 1,200 acres</p>
                    <p>Workers: 24</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Performance Metrics */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-6">Performance Metrics</h2>
              <div className="grid grid-cols-2 gap-6">
                {performanceData.map((item, index) => (
                  <div key={index} className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-700">{item.metric}</span>
                      <span className="text-sm font-bold text-gray-900">{item.value}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className="h-3 rounded-full transition-all duration-300"
                        style={{
                          width: `${item.value}%`,
                          backgroundColor: item.color
                        }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Revenue Analytics */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">Revenue Analytics</h2>
                <select className="text-sm border border-gray-300 rounded px-3 py-1">
                  <option>Last 12 Months</option>
                  <option>Last 6 Months</option>
                  <option>Last 3 Months</option>
                </select>
              </div>
              
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={revenueData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="revenue" fill="#3b82f6" name="Revenue" />
                    <Bar dataKey="profit" fill="#22c55e" name="Profit" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Right Column - Crop Distribution and Activities */}
          <div className="space-y-8">
            {/* Crop Distribution */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-6">Crop Distribution</h2>
              
              <div className="h-64 mb-6">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={cropDistributionData}
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={80}
                      dataKey="value"
                    >
                      {cropDistributionData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="space-y-3">
                {cropDistributionData.map((item, index) => (
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
                      <div className="text-xs text-gray-500">{item.acres} acres</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Activities */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">Recent Activities</h2>
                <button className="text-sm text-blue-600 hover:text-blue-800">View All</button>
              </div>

              <div className="space-y-4">
                {recentActivities.map((activity) => (
                  <div key={activity.id} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                    <div className={`w-2 h-2 rounded-full mt-2 ${
                      activity.type === 'harvest' ? 'bg-green-500' :
                      activity.type === 'maintenance' ? 'bg-blue-500' :
                      activity.type === 'inspection' ? 'bg-yellow-500' :
                      'bg-purple-500'
                    }`}></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{activity.activity}</p>
                      <p className="text-xs text-gray-500">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-6">Quick Actions</h2>
              <div className="grid grid-cols-2 gap-3">
                <button className="p-3 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors">
                  <Package className="w-5 h-5 mx-auto mb-1" />
                  <span className="text-xs font-medium">Add Crop</span>
                </button>
                <button className="p-3 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors">
                  <MapPin className="w-5 h-5 mx-auto mb-1" />
                  <span className="text-xs font-medium">New Farm</span>
                </button>
                <button className="p-3 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors">
                  <Users className="w-5 h-5 mx-auto mb-1" />
                  <span className="text-xs font-medium">Add Worker</span>
                </button>
                <button className="p-3 bg-orange-100 text-orange-700 rounded-lg hover:bg-orange-200 transition-colors">
                  <TrendingUp className="w-5 h-5 mx-auto mb-1" />
                  <span className="text-xs font-medium">Reports</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManagerDashboard;

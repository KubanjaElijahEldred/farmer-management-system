import React, { type ReactNode } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { Settings, Bell, LogOut } from 'lucide-react';

interface DashboardLayoutProps {
  children: ReactNode;
  title: string;
  role: string;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children, title, role }) => {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            {/* Logo and Title */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-xl">🌾</span>
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">Farmer Management System</h1>
                  <p className="text-xs text-gray-500">{role} Dashboard</p>
                </div>
              </div>
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center space-x-3">
              {/* Notifications */}
              <button 
                className="p-2 bg-yellow-50 hover:bg-yellow-100 rounded-lg transition-colors duration-200 relative"
                title="Notifications"
              >
                <Bell className="w-5 h-5 text-yellow-600" />
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">
                  3
                </span>
              </button>
              
              {/* Settings */}
              <button 
                className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors duration-200"
                title="Settings"
              >
                <Settings className="w-5 h-5 text-gray-600" />
              </button>
              
              {/* User Profile */}
              <div className="flex items-center space-x-2 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg px-3 py-2">
                <div className="w-9 h-9 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-sm">
                    {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                  </span>
                </div>
                <div className="hidden md:block">
                  <p className="text-sm font-medium text-gray-900">{user?.name || 'User'}</p>
                  <p className="text-xs text-gray-500 capitalize">{role}</p>
                </div>
              </div>
              
              {/* Logout Button */}
              <button 
                onClick={logout}
                className="p-2 bg-red-50 hover:bg-red-100 rounded-lg transition-colors duration-200 group"
                title="Logout"
              >
                <LogOut className="w-5 h-5 text-red-600 group-hover:text-red-700" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h2 className="text-3xl font-bold text-gray-900">{title}</h2>
          <p className="text-gray-600 mt-1">Welcome back, {user?.name || 'User'}!</p>
        </div>
        {children}
      </main>
    </div>
  );
};

export default DashboardLayout;

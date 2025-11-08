import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { FarmerDashboard, FinanceDashboard } from './dashboards';
import ModernManagerDashboard from './dashboards/ModernManagerDashboard';
import FieldOfficerDashboard from './FieldOfficerDashboardExact';

const Dashboard: React.FC = () => {
  const { user } = useAuth();

  // Route to appropriate dashboard based on user role
  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Loading...</h2>
          <p className="text-gray-600">Please wait while we load your dashboard.</p>
        </div>
      </div>
    );
  }

  // Render role-specific dashboard
  switch (user.role) {
    case 'farmer':
      return <FarmerDashboard />;
    case 'field_officer':
      return <FieldOfficerDashboard />;
    case 'finance':
      return <FinanceDashboard />;
    case 'manager':
      return <ModernManagerDashboard />;
    default:
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Unknown Role</h2>
            <p className="text-gray-600">Your role ({user.role}) is not recognized.</p>
          </div>
        </div>
      );
  }
};

export default Dashboard;

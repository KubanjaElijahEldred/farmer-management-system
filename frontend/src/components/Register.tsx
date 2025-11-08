import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

interface RegisterProps {
  onSwitchToLogin: () => void;
}

const Register: React.FC<RegisterProps> = ({ onSwitchToLogin }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'farmer' as 'farmer' | 'field_officer' | 'finance' | 'manager'
  });
  const [validationError, setValidationError] = useState('');
  const { register, isLoading, error } = useAuth();

  const roleOptions = [
    { value: 'farmer', label: 'Farmer', description: 'Manage your farm operations and harvests' },
    { value: 'field_officer', label: 'Field Officer', description: 'Monitor and support farmers in the field' },
    { value: 'finance', label: 'Financial Manager', description: 'Handle payments and financial operations' },
    { value: 'manager', label: 'Manager', description: 'Full system access and management' }
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setValidationError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (formData.password !== formData.confirmPassword) {
      setValidationError('Passwords do not match');
      return;
    }
    
    if (formData.password.length < 6) {
      setValidationError('Password must be at least 6 characters long');
      return;
    }

    const success = await register({
      name: formData.name,
      email: formData.email,
      password: formData.password,
      role: formData.role
    });

    if (!success) {
      // Error is handled by the auth context
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Beautiful Nature Background - Same as login */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 800 400'%3E%3Cdefs%3E%3ClinearGradient id='sky' x1='0' y1='0' x2='0' y2='1'%3E%3Cstop offset='0%25' stop-color='%23e0f2fe'/%3E%3Cstop offset='100%25' stop-color='%23b3e5fc'/%3E%3C/linearGradient%3E%3ClinearGradient id='mountain' x1='0' y1='0' x2='0' y2='1'%3E%3Cstop offset='0%25' stop-color='%238e9aaf'/%3E%3Cstop offset='100%25' stop-color='%23607d8b'/%3E%3C/linearGradient%3E%3ClinearGradient id='field' x1='0' y1='0' x2='0' y2='1'%3E%3Cstop offset='0%25' stop-color='%23aed581'/%3E%3Cstop offset='100%25' stop-color='%2366bb6a'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='800' height='400' fill='url(%23sky)'/%3E%3Cpath d='M0,200 Q200,150 400,180 T800,160 L800,400 L0,400 Z' fill='url(%23mountain)' opacity='0.7'/%3E%3Cpath d='M0,250 Q150,200 300,220 T600,200 Q700,190 800,210 L800,400 L0,400 Z' fill='url(%23mountain)' opacity='0.5'/%3E%3Cpath d='M0,300 Q100,280 200,290 T400,285 Q500,280 600,295 T800,290 L800,400 L0,400 Z' fill='url(%23field)'/%3E%3C/svg%3E")`
        }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-20"></div>
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border border-white/30 overflow-hidden p-8">
          <div className="text-center mb-6">
            <div className="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-green-100 mb-4">
              <span className="text-2xl">🌾</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Create your account
            </h2>
            <p className="text-sm text-gray-600">
              Join the Farmer Management Information System
            </p>
          </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Full Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                className="mt-1 w-full px-4 py-3 bg-white/80 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 placeholder-gray-500"
                placeholder="Enter your full name"
                value={formData.name}
                onChange={handleInputChange}
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="mt-1 w-full px-4 py-3 bg-white/80 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 placeholder-gray-500"
                placeholder="Enter your email address"
                value={formData.email}
                onChange={handleInputChange}
              />
            </div>

            <div>
              <label htmlFor="role" className="block text-sm font-medium text-gray-700">
                Account Type
              </label>
              <select
                id="role"
                name="role"
                required
                className="mt-1 w-full px-4 py-3 bg-white/80 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                value={formData.role}
                onChange={handleInputChange}
              >
                {roleOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <p className="mt-1 text-xs text-gray-500">
                {roleOptions.find(r => r.value === formData.role)?.description}
              </p>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                className="mt-1 w-full px-4 py-3 bg-white/80 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 placeholder-gray-500"
                placeholder="Create a password (min. 6 characters)"
                value={formData.password}
                onChange={handleInputChange}
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                required
                className="mt-1 w-full px-4 py-3 bg-white/80 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 placeholder-gray-500"
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChange={handleInputChange}
              />
            </div>
          </div>

          {(error || validationError) && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error || validationError}
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              {isLoading ? 'Creating account...' : 'Create account'}
            </button>
          </div>

          <div className="text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <button
                type="button"
                onClick={onSwitchToLogin}
                className="font-medium text-green-600 hover:text-green-500"
              >
                Sign in
              </button>
            </p>
          </div>
        </form>
        </div>
        
        {/* Footer */}
        <div className="text-center mt-6">
          <p className="text-white text-sm opacity-90 drop-shadow-lg">
            © 2024 Farmer Management Information System
          </p>
        </div>
      </div>
      </div>
    </div>
  );
};

export default Register;

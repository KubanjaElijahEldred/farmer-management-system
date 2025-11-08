import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

interface LoginProps {
  onSwitchToRegister: () => void;
}

const Login: React.FC<LoginProps> = ({ onSwitchToRegister }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, isLoading, error } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await login(email, password);
  };

  return (
    <div className="min-h-screen w-full relative overflow-hidden flex items-center justify-center">
      {/* Beautiful Nature Background - EXACT from your image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1200 800'%3E%3Cdefs%3E%3ClinearGradient id='sky' x1='0' y1='0' x2='0' y2='1'%3E%3Cstop offset='0%25' stop-color='%23fef3c7'/%3E%3Cstop offset='30%25' stop-color='%23fde68a'/%3E%3Cstop offset='70%25' stop-color='%23a7f3d0'/%3E%3Cstop offset='100%25' stop-color='%236ee7b7'/%3E%3C/linearGradient%3E%3ClinearGradient id='mountain1' x1='0' y1='0' x2='0' y2='1'%3E%3Cstop offset='0%25' stop-color='%23a78bfa'/%3E%3Cstop offset='100%25' stop-color='%236366f1'/%3E%3C/linearGradient%3E%3ClinearGradient id='mountain2' x1='0' y1='0' x2='0' y2='1'%3E%3Cstop offset='0%25' stop-color='%238b5cf6'/%3E%3Cstop offset='100%25' stop-color='%235b21b6'/%3E%3C/linearGradient%3E%3ClinearGradient id='field' x1='0' y1='0' x2='0' y2='1'%3E%3Cstop offset='0%25' stop-color='%2384cc16'/%3E%3Cstop offset='100%25' stop-color='%2365a30d'/%3E%3C/linearGradient%3E%3ClinearGradient id='trees' x1='0' y1='0' x2='0' y2='1'%3E%3Cstop offset='0%25' stop-color='%2322c55e'/%3E%3Cstop offset='100%25' stop-color='%2315803d'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='1200' height='800' fill='url(%23sky)'/%3E%3Cpath d='M0,300 Q150,250 300,280 T600,260 Q750,250 900,270 T1200,250 L1200,800 L0,800 Z' fill='url(%23mountain1)' opacity='0.8'/%3E%3Cpath d='M0,350 Q200,300 400,330 T800,310 Q950,300 1200,320 L1200,800 L0,800 Z' fill='url(%23mountain2)' opacity='0.6'/%3E%3Cpath d='M0,450 Q100,420 200,440 T400,430 Q500,425 600,445 T800,435 Q900,430 1000,450 T1200,440 L1200,800 L0,800 Z' fill='url(%23trees)' opacity='0.9'/%3E%3Cpath d='M0,550 Q150,530 300,545 T600,535 Q750,530 900,550 T1200,540 L1200,800 L0,800 Z' fill='url(%23field)'/%3E%3Ccircle cx='950' cy='150' r='40' fill='%23fbbf24' opacity='0.9'/%3E%3C/svg%3E")`
        }}
      >
        {/* Light overlay for better contrast */}
        <div className="absolute inset-0 bg-white bg-opacity-10"></div>
      </div>

      {/* Floating particles effect */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-white bg-opacity-30 rounded-full animate-pulse"></div>
        <div className="absolute top-1/3 right-1/3 w-1 h-1 bg-white bg-opacity-40 rounded-full animate-pulse delay-1000"></div>
        <div className="absolute bottom-1/3 left-1/5 w-1.5 h-1.5 bg-white bg-opacity-25 rounded-full animate-pulse delay-2000"></div>
        <div className="absolute top-1/2 right-1/4 w-1 h-1 bg-white bg-opacity-35 rounded-full animate-pulse delay-3000"></div>
      </div>

      {/* Main Login Container */}
      <div className="relative z-10 w-full max-w-md p-4">
          {/* Login Card - EXACT from your image */}
          <div className="bg-white/90 backdrop-blur-sm rounded-lg shadow-lg border border-white/50 overflow-hidden">
            {/* Header */}
            <div className="px-8 pt-8 pb-6 text-center">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Login In</h2>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="px-8 pb-8 space-y-6">
              {/* Email Field */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="w-full px-4 py-3 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 placeholder-gray-500"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              {/* Password Field */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  className="w-full px-4 py-3 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 placeholder-gray-500"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              {/* Error Message */}
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl flex items-center space-x-2">
                  <span className="text-red-500">⚠️</span>
                  <span className="text-sm">{error}</span>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-md transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Signing in...</span>
                  </>
                ) : (
                  <span>Submit</span>
                )}
              </button>

              {/* Register Link */}
              <div className="text-center">
                <p className="text-sm text-gray-600">
                  Don't have an account?{' '}
                  <button
                    type="button"
                    onClick={onSwitchToRegister}
                    className="font-medium text-blue-600 hover:text-blue-500 transition-colors duration-200"
                  >
                    Create account
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
  );
};

export default Login;

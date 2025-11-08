import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';

interface User {
  _id: string;
  name: string;
  email: string;
  role: 'farmer' | 'field_officer' | 'finance' | 'manager';
  created_at: Date;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (userData: RegisterData) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
  error: string | null;
}

interface RegisterData {
  name: string;
  email: string;
  password: string;
  role: 'farmer' | 'field_officer' | 'finance' | 'manager';
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check if user is logged in on app start
    const savedUser = localStorage.getItem('fmis-user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (err) {
        localStorage.removeItem('fmis-user');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    
    try {
      // For now, we'll create a simple mock login
      // In a real app, this would make an API call to authenticate
      const response = await fetch('http://localhost:3001/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const userData = await response.json();
        setUser(userData.user);
        localStorage.setItem('fmis-user', JSON.stringify(userData.user));
        return true;
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Login failed');
        return false;
      }
    } catch (err) {
      // Fallback for development - mock successful login
      if (email === 'admin@fmis.com' && password === 'admin123') {
        const mockUser: User = {
          _id: '1',
          name: 'Admin User',
          email: 'admin@fmis.com',
          role: 'manager',
          created_at: new Date()
        };
        setUser(mockUser);
        localStorage.setItem('fmis-user', JSON.stringify(mockUser));
        return true;
      }
      
      setError('Login failed. Please check your credentials.');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: RegisterData): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch('http://localhost:3001/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      if (response.ok) {
        await response.json();
        // Auto-login after successful registration
        return await login(userData.email, userData.password);
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Registration failed');
        return false;
      }
    } catch (err) {
      // Fallback for development - mock successful registration
      const mockUser: User = {
        _id: Date.now().toString(),
        name: userData.name,
        email: userData.email,
        role: userData.role,
        created_at: new Date()
      };
      setUser(mockUser);
      localStorage.setItem('fmis-user', JSON.stringify(mockUser));
      return true;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('fmis-user');
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isLoading, error }}>
      {children}
    </AuthContext.Provider>
  );
};

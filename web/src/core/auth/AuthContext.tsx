import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { User, LoginCredentials } from '../../features/auth/types';
import { authService } from '../../features/auth/services/authService';
import { onUnauthorized } from '../api/httpClient';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Define performLogout first so it can be used in useEffect
  const performLogout = () => {
    authService.logout();
    localStorage.removeItem('tokenExpiration');
    setUser(null);
  };

  useEffect(() => {
    const initAuth = () => {
      const token = localStorage.getItem('token');
      const savedUser = localStorage.getItem('user');
      const expiration = localStorage.getItem('tokenExpiration');

      if (token && savedUser && expiration) {
        if (new Date().getTime() < parseInt(expiration)) {
          setUser(JSON.parse(savedUser));
        } else {
          // Session expired
          performLogout();
        }
      }
      setIsLoading(false);
    };

    initAuth();
    
    // Register global 401 handler
    onUnauthorized(() => {
      performLogout();
    });
  }, []);

  const login = async (credentials: LoginCredentials) => {
    try {
      const response = await authService.login(credentials);
      const { token, user } = response;
      
      const expirationTime = new Date().getTime() + 12 * 60 * 60 * 1000; // 12 hours

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('tokenExpiration', expirationTime.toString());
      
      setUser(user);
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    performLogout();
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

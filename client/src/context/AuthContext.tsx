// File: client/src/context/AuthContext.tsx
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import apiService from '../services/api';
import { User } from '../models/types';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isPremium: boolean;
  sessionId: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, confirmPassword: string) => Promise<void>;
  logout: () => void;
  refreshUserProfile: () => Promise<void>;
  setSessionId: (id: string) => void;
}

interface AuthResponse {
    user: User;
    token: string;
}

interface ProfileResponse {
    user: User;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(localStorage.getItem('sessionId'));
  const [loading, setLoading] = useState<boolean>(true);
  
  // Check if user is authenticated on mount
  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('token');
      
      if (token) {
        try {
          const response = await apiService.auth.getProfile() as ProfileResponse;
          setUser(response.user);
        } catch (error) {
          console.error('Failed to fetch user profile:', error);
          localStorage.removeItem('token');
        }
      }
      
      // Generate a session ID if none exists
      if (!sessionId) {
        const newSessionId = generateSessionId();
        localStorage.setItem('sessionId', newSessionId);
        setSessionId(newSessionId);
      }
      
      setLoading(false);
    };
    
    initAuth();
  }, [sessionId]);
  
  const login = async (email: string, password: string) => {
    setLoading(true);
    
    try {
      const response = await apiService.auth.login({ email, password }) as AuthResponse;
      
      localStorage.setItem('token', response.token);
      setUser(response.user);
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };
  
  const register = async (email: string, password: string, confirmPassword: string) => {
    setLoading(true);
    
    try {
      const response = await apiService.auth.register({ email, password, confirmPassword }) as AuthResponse;
      
      localStorage.setItem('token', response.token);
      setUser(response.user);
    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };
  
  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };
  
  const refreshUserProfile = async () => {
    if (!localStorage.getItem('token')) return;
    
    try {
      const response = await apiService.auth.getProfile() as ProfileResponse;
      setUser(response.user);
    } catch (error) {
      console.error('Failed to refresh user profile:', error);
    }
  };
  
  const updateSessionId = (id: string) => {
    localStorage.setItem('sessionId', id);
    setSessionId(id);
  };
  
  // Generate a random session ID
  const generateSessionId = () => {
    return 'session-' + Math.random().toString(36).substring(2, 15);
  };
  
  const value = {
    user,
    isAuthenticated: !!user,
    isPremium: user?.isPremium || false,
    sessionId,
    loading,
    login,
    register,
    logout,
    refreshUserProfile,
    setSessionId: updateSessionId
  };
  
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
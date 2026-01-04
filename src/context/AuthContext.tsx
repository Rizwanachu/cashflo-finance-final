import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuth as useReplitAuth } from '../hooks/use-auth';

interface AuthUser {
  userId: string;
  email: string | null;
  provider: 'google' | 'email';
  createdAt: string;
  lastLoginAt: string;
}

interface ProStatus {
  isPro: boolean;
  plan: string;
  validUntil: string | null;
  lastVerifiedAt: string;
}

interface AuthContextType {
  user: AuthUser | null;
  proStatus: ProStatus;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: () => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user: replitUser, isLoading, isAuthenticated } = useReplitAuth();
  const [proStatus, setProStatus] = useState<ProStatus>({
    isPro: false,
    plan: 'Free',
    validUntil: null,
    lastVerifiedAt: new Date().toISOString()
  });

  // Handle identity storage as per requirements
  useEffect(() => {
    if (isAuthenticated && replitUser) {
      const userData: AuthUser = {
        userId: replitUser.id,
        email: replitUser.email,
        provider: replitUser.email ? 'email' : 'google', // Rough estimation
        createdAt: new Date().toISOString(),
        lastLoginAt: new Date().toISOString()
      };
      
      // Store user metadata ONLY (not app data)
      localStorage.setItem('spendory_user', JSON.stringify(userData));
      
      // Initial Pro status check (placeholder for actual billing integration)
      checkProStatus(replitUser.id);
    }
  }, [isAuthenticated, replitUser]);

  const checkProStatus = async (userId: string) => {
    // In a real app, this would fetch from a billing provider
    // For now, we simulate a successful restoration if they were Pro before
    const cachedPro = localStorage.getItem(`pro_status_${userId}`);
    if (cachedPro) {
      setProStatus(JSON.parse(cachedPro));
    }
  };

  const login = () => {
    window.location.href = '/api/login';
  };

  const logout = () => {
    localStorage.removeItem('spendory_user');
    window.location.href = '/api/logout';
  };

  return (
    <AuthContext.Provider value={{ 
      user: replitUser ? {
        userId: replitUser.id,
        email: replitUser.email || null,
        provider: 'google', // Defaulting for simplicity in this turn
        createdAt: new Date().toISOString(),
        lastLoginAt: new Date().toISOString()
      } : null, 
      proStatus, 
      isLoading, 
      isAuthenticated,
      login,
      logout
    }}>
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

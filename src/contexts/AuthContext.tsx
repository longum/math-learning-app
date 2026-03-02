import React, { createContext, useContext, useState, useEffect } from 'react';
import { validateCredentials, saveAuthState, getAuthState, clearAuthState } from '../utils/auth';

interface AuthContextType {
  isAuthenticated: boolean;
  user: string | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<string | null>(null);

  useEffect(() => {
    const authState = getAuthState();
    if (authState?.isAuthenticated) {
      setIsAuthenticated(true);
      setUser(authState.user);
    }
  }, []);

  const login = async (username: string, password: string): Promise<boolean> => {
    if (validateCredentials(username, password)) {
      saveAuthState(username);
      setIsAuthenticated(true);
      setUser(username);
      return true;
    }
    return false;
  };

  const logout = () => {
    clearAuthState();
    setIsAuthenticated(false);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}

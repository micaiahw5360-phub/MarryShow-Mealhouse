import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/api';

export interface User {
  id: string;
  username: string;
  email: string;
  role: 'admin' | 'customer';
  walletBalance: number;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  register: (username: string, email: string, password: string) => Promise<boolean>;
  updateWalletBalance: (amount: number) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('tamcc_user');
    const token = localStorage.getItem('tamcc_token');
    if (savedUser && token) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await authService.login(email, password);
      const apiUser = response.user;
      const mappedUser: User = {
        id: apiUser.id.toString(),
        username: apiUser.username,
        email: apiUser.email,
        role: apiUser.role === 'admin' ? 'admin' : 'customer',
        walletBalance: parseFloat(apiUser.balance),
      };
      setUser(mappedUser);
      localStorage.setItem('tamcc_user', JSON.stringify(mappedUser));
      localStorage.setItem('tamcc_token', response.token);
      return true;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('tamcc_user');
    localStorage.removeItem('tamcc_token');
  };

  const register = async (username: string, email: string, password: string): Promise<boolean> => {
    try {
      const response = await authService.register(username, email, password);
      const apiUser = response.user;
      const mappedUser: User = {
        id: apiUser.id.toString(),
        username: apiUser.username,
        email: apiUser.email,
        role: 'customer',
        walletBalance: parseFloat(apiUser.balance),
      };
      setUser(mappedUser);
      localStorage.setItem('tamcc_user', JSON.stringify(mappedUser));
      localStorage.setItem('tamcc_token', response.token);
      return true;
    } catch (error) {
      console.error('Registration error:', error);
      return false;
    }
  };

  const updateWalletBalance = (amount: number) => {
    if (user) {
      const newBalance = user.walletBalance + amount;
      const updatedUser = { ...user, walletBalance: newBalance };
      setUser(updatedUser);
      localStorage.setItem('tamcc_user', JSON.stringify(updatedUser));
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, register, updateWalletBalance }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
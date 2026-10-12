import React, { createContext, useContext, useState, useEffect } from 'react';
import { getMe, loginUser, registerUser, logoutUser } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Initialize auth state on mount by fetching current user from backend
  const refreshUser = async () => {
    try {
      setLoading(true);
      const data = await getMe();
      if (data.success && data.data?.user) {
        setUser(data.data.user);
      } else {
        setUser(null);
      }
    } catch (err) {
      setUser(null);
      localStorage.removeItem('pgfinder_token');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshUser();
  }, []);

  // Login handler
  const login = async (email, password) => {
    const res = await loginUser({ email, password });
    if (res.success && res.data) {
      if (res.data.token) {
        localStorage.setItem('pgfinder_token', res.data.token);
      }
      setUser(res.data.user);
      return res.data.user;
    }
    throw new Error(res.message || 'Login failed');
  };

  // Register handler
  const register = async (userData) => {
    const res = await registerUser(userData);
    if (res.success && res.data) {
      if (res.data.token) {
        localStorage.setItem('pgfinder_token', res.data.token);
      }
      setUser(res.data.user);
      return res.data.user;
    }
    throw new Error(res.message || 'Registration failed');
  };

  // Logout handler
  const logout = async () => {
    try {
      await logoutUser();
    } catch (e) {
      // Ignore network logout error
    } finally {
      localStorage.removeItem('pgfinder_token');
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        loading,
        login,
        register,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

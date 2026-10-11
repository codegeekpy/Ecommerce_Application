import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useToast } from './ToastContext';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('aura_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState(() => {
    return localStorage.getItem('aura_token') || null;
  });

  const [loading, setLoading] = useState(false);
  const { addToast } = useToast();

  useEffect(() => {
    if (token) {
      localStorage.setItem('aura_token', token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      localStorage.removeItem('aura_token');
      delete axios.defaults.headers.common['Authorization'];
    }
  }, [token]);

  useEffect(() => {
    if (user) {
      localStorage.setItem('aura_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('aura_user');
    }
  }, [user]);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const { data } = await axios.post('/api/auth/login', { email, password });
      setUser(data);
      setToken(data.token);
      addToast(`Welcome back, ${data.name}!`, 'success');
      return { success: true, user: data };
    } catch (err) {
      const msg = err.response?.data?.message || 'Login failed. Please verify credentials.';
      addToast(msg, 'error');
      return { success: false, error: msg };
    } finally {
      setLoading(false);
    }
  };

  const register = async (name, email, password) => {
    setLoading(true);
    try {
      const { data } = await axios.post('/api/auth/register', { name, email, password });
      setUser(data);
      setToken(data.token);
      addToast(`Account created successfully! Welcome to AURA, ${data.name}.`, 'success');
      return { success: true, user: data };
    } catch (err) {
      const msg = err.response?.data?.message || 'Registration failed. Try again.';
      addToast(msg, 'error');
      return { success: false, error: msg };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('aura_user');
    localStorage.removeItem('aura_token');
    delete axios.defaults.headers.common['Authorization'];
    addToast('You have been logged out.', 'info');
  };

  const quickDemoLogin = async (role = 'admin') => {
    if (role === 'admin') {
      return await login('admin@store.com', 'admin123');
    } else {
      return await login('user@store.com', 'user123');
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAdmin: user?.role === 'admin',
        login,
        register,
        logout,
        quickDemoLogin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

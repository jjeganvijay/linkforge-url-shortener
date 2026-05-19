import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../api/axios';

const AuthContext = createContext(null);

const TOKEN_KEY = 'token';
const USER_KEY = 'user';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const clearSession = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    setUser(null);
  }, []);

  useEffect(() => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) {
      setLoading(false);
      return;
    }

    const savedUser = localStorage.getItem(USER_KEY);
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch {
        localStorage.removeItem(USER_KEY);
      }
    }

    api
      .get('/auth/me')
      .then((res) => {
        const userData = res.data.data.user;
        setUser(userData);
        localStorage.setItem(USER_KEY, JSON.stringify(userData));
      })
      .catch(() => {
        clearSession();
      })
      .finally(() => setLoading(false));
  }, [clearSession]);

  const persistSession = (token, userData) => {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(userData));
    setUser(userData);
  };

  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    const { token, user: userData } = res.data.data;
    persistSession(token, userData);
    return res.data;
  };

  const signup = async (name, email, password) => {
    const res = await api.post('/auth/signup', { name, email, password });
    const { token, user: userData } = res.data.data;
    persistSession(token, userData);
    return res.data;
  };

  const logout = () => {
    clearSession();
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout, clearSession }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};

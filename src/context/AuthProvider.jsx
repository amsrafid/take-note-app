import { useEffect, useState } from 'react';
import request from '../api/client';
import { AuthContext } from './AuthContext';

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(!!localStorage.getItem('token'));

  useEffect(() => {
    if (!token) return;
    request('/auth/me', { token })
      .then(setUser)
      .catch(() => {
        setToken('');
        localStorage.removeItem('token');
      })
      .finally(() => setLoading(false));
  }, [token]);

  const login = (newToken, newUser) => {
    localStorage.setItem('token', newToken);
    setToken(newToken);
    setUser(newUser);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken('');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ token, user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

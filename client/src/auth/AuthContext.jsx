import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { fetchSession, login as apiLogin, logout as apiLogout } from '../api/auth.js';
import { onUnauthorized } from '../lib/authEvents.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [authenticated, setAuthenticated] = useState(null);

  useEffect(() => {
    fetchSession().then(setAuthenticated);
  }, []);

  useEffect(() => onUnauthorized(() => setAuthenticated(false)), []);

  const login = useCallback(async (password) => {
    await apiLogin(password);
    setAuthenticated(true);
  }, []);

  const logout = useCallback(async () => {
    await apiLogout();
    setAuthenticated(false);
  }, []);

  return (
    <AuthContext.Provider value={{ authenticated, login, logout }}>{children}</AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

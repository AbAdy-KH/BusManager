import { useState, useEffect, useMemo, useCallback } from 'react';
import { AuthContext } from './AuthContextInstance';
import {
  getStoredTokens,
  parseJwt,
  loginApi,
  logoutApi,
  refreshTokensApi,
} from '../services/authService';
import { getApiBaseUrl, setApiBaseUrl as saveApiBaseUrl } from '../config/api.config';

export function AuthProvider({ children }) {
  const [tokens, setTokens] = useState(() => getStoredTokens());
  const [baseUrl, setBaseUrlState] = useState(() => getApiBaseUrl());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Listen to external API URL change events
  useEffect(() => {
    const handleUrlChange = (e) => {
      setBaseUrlState(e.detail || getApiBaseUrl());
    };
    window.addEventListener('busmanager_api_url_changed', handleUrlChange);
    return () => {
      window.removeEventListener('busmanager_api_url_changed', handleUrlChange);
    };
  }, []);

  // Derive user directly from tokens
  const user = useMemo(() => {
    return tokens?.accessToken ? parseJwt(tokens.accessToken) : null;
  }, [tokens]);

  const updateBaseUrl = useCallback((newUrl) => {
    saveApiBaseUrl(newUrl);
    setBaseUrlState(getApiBaseUrl());
  }, []);

  const login = useCallback(async (credentials) => {
    setLoading(true);
    setError(null);
    try {
      const result = await loginApi(credentials);
      setTokens(result);
      const decoded = parseJwt(result.accessToken);
      return { success: true, user: decoded };
    } catch (err) {
      setError(err.message || 'Login failed');
      return { success: false, error: err.message || 'Login failed' };
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    setLoading(true);
    try {
      await logoutApi();
    } finally {
      setTokens(null);
      setError(null);
      setLoading(false);
    }
  }, []);

  const refreshToken = useCallback(async () => {
    try {
      const result = await refreshTokensApi(tokens);
      setTokens(result);
      return result;
    } catch (err) {
      logout();
      throw err;
    }
  }, [tokens, logout]);

  const value = useMemo(
    () => ({
      user,
      tokens,
      baseUrl,
      loading,
      error,
      isAuthenticated: !!user,
      login,
      logout,
      refreshToken,
      setBaseUrl: updateBaseUrl,
      clearError: () => setError(null),
    }),
    [user, tokens, baseUrl, loading, error, login, logout, refreshToken, updateBaseUrl]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

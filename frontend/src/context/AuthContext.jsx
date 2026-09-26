import { useState, useMemo, useCallback, useEffect } from 'react';
import { AuthContext } from './AuthContextInstance';
import {
  getStoredTokens,
  parseJwt,
  loginApi,
  logoutApi,
  refreshTokensApi,
  onTokensChanged,
} from '../services/authService';

export function AuthProvider({ children }) {
  const [tokens, setTokens] = useState(() => getStoredTokens());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Synchronize state when tokens change anywhere in authService
  useEffect(() => {
    return onTokensChanged((newTokens) => {
      setTokens(newTokens);
    });
  }, []);

  // Proactively refresh tokens before the access token expires
  useEffect(() => {
    if (!tokens?.accessToken || !tokens?.refreshToken) return;

    const parsed = parseJwt(tokens.accessToken);
    if (!parsed?.exp) return;

    // Refresh 1 minute before expiry (or in 10s if already less than 1 min left)
    const msUntilExpiry = parsed.exp.getTime() - Date.now();
    const refreshDelay = Math.max(msUntilExpiry - 60 * 1000, 10000);

    const timer = setTimeout(async () => {
      try {
        await refreshTokensApi(tokens);
      } catch (err) {
        console.warn('Proactive background token refresh failed:', err);
      }
    }, refreshDelay);

    return () => clearTimeout(timer);
  }, [tokens]);

  // Derive user directly from tokens
  const user = useMemo(() => {
    return tokens?.accessToken ? parseJwt(tokens.accessToken) : null;
  }, [tokens]);

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
      loading,
      error,
      isAuthenticated: !!user,
      login,
      logout,
      refreshToken,
      clearError: () => setError(null),
    }),
    [user, tokens, loading, error, login, logout, refreshToken]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

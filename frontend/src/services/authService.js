import { getApiBaseUrl, API_ROUTES } from '../config/api.config';

const TOKENS_KEY = 'busmanager_auth_tokens';

/**
 * Parses a JWT token to extract claims (e.g. email, name, roles, expiry).
 */
export function parseJwt(token) {
  if (!token) return null;
  try {
    const base64Url = token.split('.')[1];
    if (!base64Url) return null;
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    const payload = JSON.parse(jsonPayload);

    // Extract common claim mappings from ASP.NET Identity
    const id =
      payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'] ||
      payload.nameid ||
      payload.sub;
    const email =
      payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'] ||
      payload.email;
    const name = payload.Name || payload.name || payload.unique_name;
    const roleClaim =
      payload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] || payload.role;

    const roles = Array.isArray(roleClaim) ? roleClaim : roleClaim ? [roleClaim] : [];

    return {
      id,
      email,
      name,
      roles,
      exp: payload.exp ? new Date(payload.exp * 1000) : null,
      raw: payload,
    };
  } catch (err) {
    console.error('Failed to parse JWT token:', err);
    return null;
  }
}

/**
 * Retrieves saved tokens from localStorage.
 * @returns {{ accessToken: string, refreshToken: string } | null}
 */
export function getStoredTokens() {
  try {
    const raw = localStorage.getItem(TOKENS_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

/**
 * Returns access token string if available.
 */
export function getAccessToken() {
  const tokens = getStoredTokens();
  return tokens?.accessToken || null;
}

/**
 * Saves tokens to localStorage.
 */
export function storeTokens(tokens) {
  if (!tokens) {
    localStorage.removeItem(TOKENS_KEY);
  } else {
    localStorage.setItem(TOKENS_KEY, JSON.stringify(tokens));
  }
}

/**
 * Clears stored tokens.
 */
export function clearStoredTokens() {
  localStorage.removeItem(TOKENS_KEY);
}

/**
 * Calls backend POST /api/auth/login with LoginRequestDto.
 * @param {{ email: string, password: string }} credentials
 * @returns {Promise<{ accessToken: string, refreshToken: string }>}
 */
export async function loginApi({ email, password }) {
  const baseUrl = getApiBaseUrl();
  const response = await fetch(`${baseUrl}${API_ROUTES.AUTH.LOGIN}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({
      Email: email.trim(),
      Password: password,
    }),
  });

  if (!response.ok) {
    let errorMessage = 'Login failed. Please check your credentials.';
    try {
      const errorData = await response.json();
      if (typeof errorData === 'string') {
        errorMessage = errorData;
      } else if (errorData.message || errorData.title) {
        errorMessage = errorData.message || errorData.title;
      }
    } catch {
      if (response.status === 401) {
        errorMessage = 'Invalid email or password.';
      } else if (response.status === 429) {
        errorMessage = 'Too many login attempts. Please try again later.';
      } else {
        errorMessage = `Server returned status ${response.status}`;
      }
    }
    throw new Error(errorMessage);
  }

  const tokens = await response.json();
  storeTokens(tokens);
  return tokens;
}

/**
 * Calls backend POST /api/auth/refresh with TokensDto.
 */
export async function refreshTokensApi(tokens) {
  const baseUrl = getApiBaseUrl();
  const currentTokens = tokens || getStoredTokens();
  if (!currentTokens?.accessToken || !currentTokens?.refreshToken) {
    throw new Error('No active tokens to refresh');
  }

  const response = await fetch(`${baseUrl}${API_ROUTES.AUTH.REFRESH}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({
      AccessToken: currentTokens.accessToken,
      RefreshToken: currentTokens.refreshToken,
    }),
  });

  if (!response.ok) {
    clearStoredTokens();
    throw new Error('Session expired. Please log in again.');
  }

  const newTokens = await response.json();
  storeTokens(newTokens);
  return newTokens;
}

/**
 * Calls backend POST /api/auth/logout with TokensDto.
 */
export async function logoutApi() {
  const baseUrl = getApiBaseUrl();
  const tokens = getStoredTokens();

  if (tokens?.accessToken && tokens?.refreshToken) {
    try {
      await fetch(`${baseUrl}${API_ROUTES.AUTH.LOGOUT}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          AccessToken: tokens.accessToken,
          RefreshToken: tokens.refreshToken,
        }),
      });
    } catch (err) {
      console.warn('Logout request failed:', err);
    }
  }

  clearStoredTokens();
}

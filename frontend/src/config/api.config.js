/**
 * Centralized Global API Configuration
 */

const API_BASE_URL_STORAGE_KEY = 'busmanager_api_base_url';

export const DEFAULT_API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'https://localhost:7148';

/**
 * Returns the currently active global API base URL.
 */
export function getApiBaseUrl() {
  const stored = localStorage.getItem(API_BASE_URL_STORAGE_KEY);
  return (stored || DEFAULT_API_BASE_URL).trim().replace(/\/+$/, '');
}

/**
 * Updates the global API base URL in localStorage.
 */
export function setApiBaseUrl(newUrl) {
  if (!newUrl) {
    localStorage.removeItem(API_BASE_URL_STORAGE_KEY);
  } else {
    localStorage.setItem(API_BASE_URL_STORAGE_KEY, newUrl.trim().replace(/\/+$/, ''));
  }
  window.dispatchEvent(new CustomEvent('busmanager_api_url_changed', { detail: getApiBaseUrl() }));
}

/**
 * Builds the full URL for a SignalR hub endpoint.
 * @param {string} hubPath - e.g. '/trackingHub'
 */
export function getHubUrl(hubPath = '/trackingHub') {
  const base = getApiBaseUrl();
  const normalizedPath = hubPath.startsWith('/') ? hubPath : `/${hubPath}`;
  return `${base}${normalizedPath}`;
}

/**
 * API Route definitions matching backend ASP.NET Core Controllers.
 */
export const API_ROUTES = {
  AUTH: {
    LOGIN: '/api/auth/login',
    REGISTER: '/api/auth/register',
    REFRESH: '/api/auth/refresh',
    LOGOUT: '/api/auth/logout',
  },
  HUBS: {
    TRACKING: '/trackingHub',
  },
  BUSES: {
    ALL: '/api/bus/all',
  },
  DRIVERS: {
    ALL: '/api/driver/all',
  },
  TRIPS: {
    LIST: '/api/trip/List',
  },
  STOPS: {
    ALL: '/api/stop/all',
  },
};

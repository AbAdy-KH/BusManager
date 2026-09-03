/**
 * Centralized API & Hub Routes Configuration
 */

export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:5278';

export function getApiBaseUrl() {
  return API_BASE_URL.replace(/\/+$/, '');
}

export function getHubUrl(hubPath = '/trackingHub') {
  const base = getApiBaseUrl();
  const normalizedPath = hubPath.startsWith('/') ? hubPath : `/${hubPath}`;
  return `${base}${normalizedPath}`;
}

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

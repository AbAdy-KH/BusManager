/**
 * Centralized API & Hub Routes Configuration
 */
// const port = 'http://localhost:5278';
const port = 'https://localhost:7148';


export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || port;

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
    ALL: '/api/bus',
  },
  DRIVERS: {
    ALL: '/api/driver',
  },
  TRIPS: {
    LIST: '/api/trip',
  },
  STOPS: {
    ALL: '/api/stop',
  },
  BUS_DRIVER: {
    ALL: '/api/BusDriver',
    ASSIGN: '/api/BusDriver/assign',
    BY_ID: (id) => `/api/BusDriver/${id}`,
    TODAY_DRIVER: (driverId) => `/api/BusDriver/today/driver/${driverId}`,
  },
};

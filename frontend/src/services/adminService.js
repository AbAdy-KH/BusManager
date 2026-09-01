import { getApiBaseUrl, API_ROUTES } from '../config/api.config';
import { getAccessToken } from './authService';

/**
 * Returns today's date formatted as YYYY-MM-DD for API filtering.
 */
export function getTodayDateString() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Helper to perform authenticated GET requests.
 */
async function fetchWithAuth(endpoint) {
  const baseUrl = getApiBaseUrl();
  const token = getAccessToken();

  const headers = {
    Accept: 'application/json',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${baseUrl}${endpoint}`, {
    method: 'GET',
    headers,
  });

  if (!response.ok) {
    let errorDetail = `Failed to fetch from ${endpoint} (Status ${response.status})`;
    try {
      const errorData = await response.json();
      if (typeof errorData === 'string') errorDetail = errorData;
      else if (errorData.message || errorData.title) errorDetail = errorData.message || errorData.title;
    } catch {
      // ignore
    }
    throw new Error(errorDetail);
  }

  return response.json();
}

/**
 * Fetches all buses from GET /api/bus/all.
 * @returns {Promise<Array<{ id: string, number: number, plateNumber: string, capacity: number, isActive: boolean }>>}
 */
export async function fetchBuses() {
  return fetchWithAuth(API_ROUTES.BUSES.ALL);
}

/**
 * Fetches all drivers from GET /api/driver/all.
 * @returns {Promise<Array<{ driverId: string, name: string, licenseNumber: string }>>}
 */
export async function fetchDrivers() {
  return fetchWithAuth(API_ROUTES.DRIVERS.ALL);
}

/**
 * Fetches trips from GET /api/trip/List.
 * Defaults to current day's trips (YYYY-MM-DD). Pass null for all trips.
 * @param {string|null} date - Filter date string (YYYY-MM-DD) or null for all trips
 * @returns {Promise<Array<{ tripId: string, driverName: string|null, busNumber: number|null, routeName: string, status: string, scheduledStartTime: string, scheduledArrivalTime: string, direction: string }>>}
 */
export async function fetchTrips(date = getTodayDateString()) {
  const query = date ? `?date=${encodeURIComponent(date)}` : '';
  return fetchWithAuth(`${API_ROUTES.TRIPS.LIST}${query}`);
}

/**
 * Fetches all stop points from GET /api/stop/all.
 * @returns {Promise<Array<{ id: string, name: string, address: string|null, latitude: number, longitude: number, isDropPoint: boolean, isActive: boolean }>>}
 */
export async function fetchStops() {
  return fetchWithAuth(API_ROUTES.STOPS.ALL);
}

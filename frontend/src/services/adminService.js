import { getApiBaseUrl, API_ROUTES } from '../config/api.config';
import { getValidAccessToken, refreshTokensApi } from './authService';

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
 * Helper to perform authenticated HTTP requests with automatic token refresh and retry.
 */
async function fetchWithAuth(endpoint, options = {}, isRetry = false) {
  const baseUrl = getApiBaseUrl();
  const token = await getValidAccessToken();

  const headers = {
    Accept: 'application/json',
    ...(options.headers || {}),
  };

  if (options.body && typeof options.body === 'object' && !(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
    options.body = JSON.stringify(options.body);
  }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  console.log(options);

  const response = await fetch(`${baseUrl}${endpoint}`, {
    ...options,
    headers,
  });

  // If 401 Unauthorized received, attempt a single refresh and retry
  if (response.status === 401 && !isRetry) {
    try {
      const refreshed = await refreshTokensApi();
      if (refreshed?.accessToken) {
        return fetchWithAuth(endpoint, options, true);
      }
    } catch (refreshErr) {
      console.warn('Token refresh on 401 failed:', refreshErr);
    }
  }

  if (!response.ok) {
    let errorDetail = `Failed request to ${endpoint} (Status ${response.status})`;
    try {
      const errorData = await response.json();
      if (typeof errorData === 'string') errorDetail = errorData;
      else if (errorData.message || errorData.title) errorDetail = errorData.message || errorData.title;
    } catch {
      // ignore
    }
    throw new Error(errorDetail);
  }

  // Handle 204 No Content or empty bodies
  const contentType = response.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    return response.json();
  }
  return response.text();
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
 * Fetches a single trip by ID from GET /api/trip/{id}.
 * @param {string} id
 */
export async function fetchTripById(id) {
  return fetchWithAuth(API_ROUTES.TRIPS.BY_ID(id));
}

/**
 * Creates a new trip by POSTing to /api/trip.
 * @param {{ routeId?: string|null, scheduledStartTime: string, scheduledArrivalTime: string, direction: number, notes?: string|null }} tripData
 */
export async function createTrip(tripData) {
  return fetchWithAuth(API_ROUTES.TRIPS.CREATE, {
    method: 'POST',
    body: tripData,
  });

}
 
/**
 * Updates an existing trip by PUT to /api/trip/{id}.
 * @param {string} id
 * @param {{ routeId?: string|null, scheduledStartTime: string, scheduledArrivalTime: string, direction: number, notes?: string|null }} tripData
 */
export async function updateTrip(id, tripData) {
  return fetchWithAuth(API_ROUTES.TRIPS.UPDATE(id), {
    method: 'PUT',
    body: tripData,
  });
}

/**
 * Deletes a trip by DELETE to /api/trip/{id}.
 * @param {string} id
 */
export async function deleteTrip(id) {
  return fetchWithAuth(API_ROUTES.TRIPS.DELETE(id), {
    method: 'DELETE',
  });
}

/**
 * Fetches all stop points from GET /api/stop/all.
 * @returns {Promise<Array<{ id: string, name: string, address: string|null, latitude: number, longitude: number, isDropPoint: boolean, isActive: boolean }>>}
 */
export async function fetchStops() {
  return fetchWithAuth(API_ROUTES.STOPS.ALL);
}

/**
 * Fetches all bus-driver assignments from GET /api/BusDriver/all.
 * Can be filtered by date.
 * @param {string|null} date - Filter date (YYYY-MM-DD) or null for all
 * @returns {Promise<Array<{ id: string, busId: string, busNumber: number|null, plateNumber: string|null, driverId: string, driverName: string|null, licenseNumber: string|null, createdAt: string }>>}
 */
export async function fetchBusDriverAssignments(date = getTodayDateString()) {
  const query = date ? `?date=${encodeURIComponent(date)}` : '';
  return fetchWithAuth(`${API_ROUTES.BUS_DRIVER.ALL}${query}`);
}

/**
 * Assigns a bus to a driver for today (or specified date).
 * Calls POST /api/BusDriver/assign.
 * @param {{ busId: string, driverId: string, createdAt?: string }} assignmentData
 */
export async function assignBusToDriver(assignmentData) {
  return fetchWithAuth(API_ROUTES.BUS_DRIVER.ASSIGN, {
    method: 'POST',
    body: assignmentData,
  });
}

/**
 * Deletes / unassigns a bus-driver assignment.
 * Calls DELETE /api/BusDriver/{id}.
 * @param {string} id
 */
export async function deleteBusDriverAssignment(id) {
  return fetchWithAuth(API_ROUTES.BUS_DRIVER.BY_ID(id), {
    method: 'DELETE',
  });
}

/**
 * Fetches today's assigned bus for a specific driver.
 * Calls GET /api/BusDriver/today/driver/{driverId}.
 * @param {string} driverId
 */
export async function fetchTodayDriverAssignment(driverId) {
  try {
    return await fetchWithAuth(API_ROUTES.BUS_DRIVER.TODAY_DRIVER(driverId));
  } catch (err) {
    // 404 means no assignment today
    return null;
  }
}


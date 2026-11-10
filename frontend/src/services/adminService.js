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

/** Fetch a single bus by ID */
export async function fetchBusById(id) {
  return fetchWithAuth(API_ROUTES.BUSES.BY_ID(id));
}

/** Create a new bus */
export async function createBus(busData) {
  return fetchWithAuth(API_ROUTES.BUSES.CREATE, { method: 'POST', body: busData });
}

/** Update an existing bus */
export async function updateBus(id, busData) {
  return fetchWithAuth(API_ROUTES.BUSES.UPDATE(id), { method: 'PUT', body: busData });
}

/** Delete a bus */
export async function deleteBus(id) {
  return fetchWithAuth(API_ROUTES.BUSES.DELETE(id), { method: 'DELETE' });
}

/**
 * Fetches all drivers from GET /api/driver (list endpoint).
 */
export async function fetchDrivers() {
  return fetchWithAuth(API_ROUTES.DRIVERS.LIST);
}

/** Fetch a single driver by ID */
export async function fetchDriverById(id) {
  return fetchWithAuth(API_ROUTES.DRIVERS.BY_ID(id));
}

/** Create a new driver */
export async function createDriver(driverData) {
  return fetchWithAuth(API_ROUTES.DRIVERS.CREATE, { method: 'POST', body: driverData });
}

/** Update an existing driver */
export async function updateDriver(id, driverData) {
  return fetchWithAuth(API_ROUTES.DRIVERS.UPDATE(id), { method: 'PUT', body: driverData });
}

/** Delete a driver */
export async function deleteDriver(id) {
  return fetchWithAuth(API_ROUTES.DRIVERS.DELETE(id), { method: 'DELETE' });
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
 * Starts a trip by POST to /api/trip/{id}/start.
 * @param {string} id
 */
export async function startTrip(id) {
  return fetchWithAuth(API_ROUTES.TRIPS.START(id), {
    method: 'POST',
  });
}

/**
 * Ends/completes a trip by POST to /api/trip/{id}/end.
 * @param {string} id
 */
export async function endTrip(id) {
  return fetchWithAuth(API_ROUTES.TRIPS.END(id), {
    method: 'POST',
  });
}

/**
 * Fetches all stop points from GET /api/stop/all.
 * @returns {Promise<Array<{ id: string, name: string, address: string|null, latitude: number, longitude: number, isDropPoint: boolean, isActive: boolean }>>}
 */
export async function fetchStops() {
  return fetchWithAuth(API_ROUTES.STOPS.ALL);
}

/** Fetch a single stop by ID */
export async function fetchStopById(id) {
  return fetchWithAuth(API_ROUTES.STOPS.BY_ID(id));
}

/** Create a new stop */
export async function createStop(stopData) {
  return fetchWithAuth(API_ROUTES.STOPS.CREATE, { method: 'POST', body: stopData });
}

/** Update an existing stop */
export async function updateStop(id, stopData) {
  return fetchWithAuth(API_ROUTES.STOPS.UPDATE(id), { method: 'PUT', body: stopData });
}

/** Delete a stop */
export async function deleteStop(id) {
  return fetchWithAuth(API_ROUTES.STOPS.DELETE(id), { method: 'DELETE' });
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

/**
 * Fetches all routes from GET /api/route.
 * @returns {Promise<Array<{ id: string, name: string, code: string }>>}
 */
export async function fetchRoutes() {
  return fetchWithAuth(API_ROUTES.ROUTES.ALL);
}

/** Fetch a single route by ID */
export async function fetchRouteById(id) {
  return fetchWithAuth(API_ROUTES.ROUTES.BY_ID(id));
}

/** Create a new route */
export async function createRoute(routeData) {
  return fetchWithAuth(API_ROUTES.ROUTES.CREATE, { method: 'POST', body: routeData });
}

/** Update an existing route */
export async function updateRoute(id, routeData) {
  return fetchWithAuth(API_ROUTES.ROUTES.UPDATE(id), { method: 'PUT', body: routeData });
}

/** Delete a route */
export async function deleteRoute(id) {
  return fetchWithAuth(API_ROUTES.ROUTES.DELETE(id), { method: 'DELETE' });
}

/**
 * Fetches all route stop assignments, optionally filtered by routeId.
 * Calls GET /api/RouteStop(?routeId=...).
 * @param {string|null} routeId
 * @returns {Promise<Array<{ routeId: string, routeName: string, routeCode: string, stopPointId: string, stopPointName: string, stopPointAddress: string|null, stopPointLatitude: number, stopPointLongitude: number, sequenceOrder: number, estimatedMinutesFromStart: number|null }>>}
 */
export async function fetchRouteStops(routeId = null) {
  const query = routeId ? `?routeId=${encodeURIComponent(routeId)}` : '';
  return fetchWithAuth(`${API_ROUTES.ROUTE_STOPS.ALL}${query}`);
}

/**
 * Fetches all stops assigned to a specific route, ordered by sequence.
 * Calls GET /api/RouteStop/route/{routeId}.
 * @param {string} routeId
 */
export async function fetchStopsByRouteId(routeId) {
  return fetchWithAuth(API_ROUTES.ROUTE_STOPS.BY_ROUTE(routeId));
}

/**
 * Fetches a single route-stop assignment.
 * Calls GET /api/RouteStop/{routeId}/{stopPointId}.
 */
export async function fetchRouteStopById(routeId, stopPointId) {
  return fetchWithAuth(API_ROUTES.ROUTE_STOPS.BY_ID(routeId, stopPointId));
}

/**
 * Adds a stop point to a route.
 * Calls POST /api/RouteStop.
 * @param {{ routeId: string, stopPointId: string, sequenceOrder: number, estimatedMinutesFromStart?: number|null }} routeStopData
 */
export async function addStopToRoute(routeStopData) {
  return fetchWithAuth(API_ROUTES.ROUTE_STOPS.CREATE, {
    method: 'POST',
    body: routeStopData,
  });
}

/**
 * Updates sequence order or estimated minutes for a route stop.
 * Calls PUT /api/RouteStop/{routeId}/{stopPointId}.
 * @param {string} routeId
 * @param {string} stopPointId
 * @param {{ routeId: string, stopPointId: string, sequenceOrder: number, estimatedMinutesFromStart?: number|null }} routeStopData
 */
export async function updateRouteStop(routeId, stopPointId, routeStopData) {
  return fetchWithAuth(API_ROUTES.ROUTE_STOPS.UPDATE(routeId, stopPointId), {
    method: 'PUT',
    body: routeStopData,
  });
}

/**
 * Removes a stop point from a route.
 * Calls DELETE /api/RouteStop/{routeId}/{stopPointId}.
 * @param {string} routeId
 * @param {string} stopPointId
 */
export async function removeStopFromRoute(routeId, stopPointId) {
  return fetchWithAuth(API_ROUTES.ROUTE_STOPS.DELETE(routeId, stopPointId), {
    method: 'DELETE',
  });
}



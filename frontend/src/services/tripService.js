import { API_ROUTES } from '../config/api.config';
import { fetchWithAuth } from './apiClient';
import { getTodayDateString } from '../utils/dateUtils';

export function fetchTrips(date = getTodayDateString()) {
  const query = date ? `?date=${encodeURIComponent(date)}` : '';
  return fetchWithAuth(`${API_ROUTES.TRIPS.LIST}${query}`);
}

export function fetchTripById(id) {
  return fetchWithAuth(API_ROUTES.TRIPS.BY_ID(id));
}

export function createTrip(tripData) {
  return fetchWithAuth(API_ROUTES.TRIPS.CREATE, {
    method: 'POST',
    body: tripData,
  });
}

export function updateTrip(id, tripData) {
  return fetchWithAuth(API_ROUTES.TRIPS.UPDATE(id), {
    method: 'PUT',
    body: tripData,
  });
}

export function deleteTrip(id) {
  return fetchWithAuth(API_ROUTES.TRIPS.DELETE(id), {
    method: 'DELETE',
  });
}

export function startTrip(id) {
  return fetchWithAuth(API_ROUTES.TRIPS.START(id), {
    method: 'POST',
  });
}

export function endTrip(id) {
  return fetchWithAuth(API_ROUTES.TRIPS.END(id), {
    method: 'POST',
  });
}

import { API_ROUTES } from '../config/api.config';
import { fetchWithAuth } from './apiClient';
import { getTodayDateString } from '../utils/dateUtils';

export function fetchBusDriverAssignments(date = getTodayDateString()) {
  const query = date ? `?date=${encodeURIComponent(date)}` : '';
  return fetchWithAuth(`${API_ROUTES.BUS_DRIVER.ALL}${query}`);
}

export function assignBusToDriver(assignmentData) {
  return fetchWithAuth(API_ROUTES.BUS_DRIVER.ASSIGN, {
    method: 'POST',
    body: assignmentData,
  });
}

export function deleteBusDriverAssignment(id) {
  return fetchWithAuth(API_ROUTES.BUS_DRIVER.BY_ID(id), {
    method: 'DELETE',
  });
}

export async function fetchTodayDriverAssignment(driverId) {
  try {
    return await fetchWithAuth(API_ROUTES.BUS_DRIVER.TODAY_DRIVER(driverId));
  } catch {
    return null;
  }
}

import { API_ROUTES } from '../config/api.config';
import { fetchWithAuth, createCrudService } from './apiClient';

export const routeService = createCrudService(API_ROUTES.ROUTES);

export const fetchRoutes = routeService.getAll;
export const fetchRouteById = routeService.getById;
export const createRoute = routeService.create;
export const updateRoute = routeService.update;
export const deleteRoute = routeService.remove;

export function fetchRouteStops(routeId = null) {
  const query = routeId ? `?routeId=${encodeURIComponent(routeId)}` : '';
  return fetchWithAuth(`${API_ROUTES.ROUTE_STOPS.ALL}${query}`);
}

export function fetchStopsByRouteId(routeId) {
  return fetchWithAuth(API_ROUTES.ROUTE_STOPS.BY_ROUTE(routeId));
}

export function fetchRouteStopById(routeId, stopPointId) {
  return fetchWithAuth(API_ROUTES.ROUTE_STOPS.BY_ID(routeId, stopPointId));
}

export function addStopToRoute(routeStopData) {
  return fetchWithAuth(API_ROUTES.ROUTE_STOPS.CREATE, {
    method: 'POST',
    body: routeStopData,
  });
}

export function updateRouteStop(routeId, stopPointId, routeStopData) {
  return fetchWithAuth(API_ROUTES.ROUTE_STOPS.UPDATE(routeId, stopPointId), {
    method: 'PUT',
    body: routeStopData,
  });
}

export function removeStopFromRoute(routeId, stopPointId) {
  return fetchWithAuth(API_ROUTES.ROUTE_STOPS.DELETE(routeId, stopPointId), {
    method: 'DELETE',
  });
}

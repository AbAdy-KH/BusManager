import { API_ROUTES } from '../config/api.config';
import { createCrudService } from './apiClient';

export const busService = createCrudService(API_ROUTES.BUSES);

export const fetchBuses = busService.getAll;
export const fetchBusById = busService.getById;
export const createBus = busService.create;
export const updateBus = busService.update;
export const deleteBus = busService.remove;

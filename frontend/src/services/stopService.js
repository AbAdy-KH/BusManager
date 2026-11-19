import { API_ROUTES } from '../config/api.config';
import { createCrudService } from './apiClient';

export const stopService = createCrudService(API_ROUTES.STOPS);

export const fetchStops = stopService.getAll;
export const fetchStopById = stopService.getById;
export const createStop = stopService.create;
export const updateStop = stopService.update;
export const deleteStop = stopService.remove;

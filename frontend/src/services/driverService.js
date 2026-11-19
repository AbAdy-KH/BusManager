import { API_ROUTES } from '../config/api.config';
import { createCrudService } from './apiClient';

export const driverService = createCrudService(API_ROUTES.DRIVERS);

export const fetchDrivers = driverService.getAll;
export const fetchDriverById = driverService.getById;
export const createDriver = driverService.create;
export const updateDriver = driverService.update;
export const deleteDriver = driverService.remove;

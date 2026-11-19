import { getApiBaseUrl } from '../config/api.config';
import { getValidAccessToken, refreshTokensApi } from './authService';

/**
 * Helper to perform authenticated HTTP requests with automatic token refresh and retry.
 */
export async function fetchWithAuth(endpoint, options = {}, isRetry = false) {
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

  const contentType = response.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    return response.json();
  }
  return response.text();
}

/**
 * Factory to generate standard CRUD service operations for a resource.
 */
export function createCrudService(routes) {
  return {
    getAll: () => fetchWithAuth(routes.ALL || routes.LIST),
    getById: (id) => fetchWithAuth(routes.BY_ID(id)),
    create: (data) => fetchWithAuth(routes.CREATE, { method: 'POST', body: data }),
    update: (id, data) => fetchWithAuth(routes.UPDATE(id), { method: 'PUT', body: data }),
    remove: (id) => fetchWithAuth(routes.DELETE(id), { method: 'DELETE' }),
  };
}

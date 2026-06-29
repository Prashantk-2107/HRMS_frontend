import apiInstance from './axios.js';
import { setupInterceptors } from './interceptor.js';
import { AUTH_ENDPOINTS, EMPLOYEE_ENDPOINTS } from './endpoints.js';

setupInterceptors(apiInstance);

const api = {
  get: (url, config = {}) => apiInstance.get(url, config),
  post: (url, data = {}, config = {}) => apiInstance.post(url, data, config),
  put: (url, data = {}, config = {}) => apiInstance.put(url, data, config),
  patch: (url, data = {}, config = {}) => apiInstance.patch(url, data, config),
  delete: (url, config = {}) => apiInstance.delete(url, config),
};

export { AUTH_ENDPOINTS, EMPLOYEE_ENDPOINTS };
export default api;

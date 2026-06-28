import apiInstance from './axios.js';
import { setupInterceptors } from './interceptor.js';
import { AUTH_ENDPOINTS, EMPLOYEE_ENDPOINTS } from './endpoints.js';

// Setup request and response interceptors
setupInterceptors(apiInstance);

/**
 * API Wrapper containing helper methods for HTTP requests.
 */
const api = {
  /**
   * Send a GET request.
   * @param {string} url - Request URL
   * @param {Object} [config] - Request configuration
   * @returns {Promise<any>}
   */
  get: (url, config = {}) => apiInstance.get(url, config),

  /**
   * Send a POST request.
   * @param {string} url - Request URL
   * @param {any} [data] - Request body
   * @param {Object} [config] - Request configuration
   * @returns {Promise<any>}
   */
  post: (url, data = {}, config = {}) => apiInstance.post(url, data, config),

  /**
   * Send a PUT request.
   * @param {string} url - Request URL
   * @param {any} [data] - Request body
   * @param {Object} [config] - Request configuration
   * @returns {Promise<any>}
   */
  put: (url, data = {}, config = {}) => apiInstance.put(url, data, config),

  /**
   * Send a PATCH request.
   * @param {string} url - Request URL
   * @param {any} [data] - Request body
   * @param {Object} [config] - Request configuration
   * @returns {Promise<any>}
   */
  patch: (url, data = {}, config = {}) => apiInstance.patch(url, data, config),

  /**
   * Send a DELETE request.
   * @param {string} url - Request URL
   * @param {Object} [config] - Request configuration
   * @returns {Promise<any>}
   */
  delete: (url, config = {}) => apiInstance.delete(url, config),
};

export { AUTH_ENDPOINTS, EMPLOYEE_ENDPOINTS };
export default api;

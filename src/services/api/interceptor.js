import axios from 'axios';
import { useAuthStore } from '../../store/auth.store.js';
import { AUTH_ENDPOINTS } from './endpoints.js';

let isRefreshing = false;
let failedQueue = [];

/**
 * Iterates through the failed requests queue and either resolves or rejects them.
 * @param {Error|null} error - The refresh token request error (if failed)
 * @param {string|null} token - The new access token (if succeeded)
 */
const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

/**
 * Configure request and response interceptors on the Axios instance.
 * @param {AxiosInstance} axiosInstance - The configured Axios instance
 */
export const setupInterceptors = (axiosInstance) => {
  // Request Interceptor: Automatically attach the authorization token to headers
  axiosInstance.interceptors.request.use(
    (config) => {
      const token = useAuthStore.getState().accessToken;
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // Response Interceptor: Handle success response or refresh expired token on 401 error
  axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;
      const status = error.response ? error.response.status : null;

      // Handle 401 Unauthorized errors (token expiration)
      if (status === 401 && !originalRequest._retry) {
        // If refreshing is already in progress, queue the current request
        if (isRefreshing) {
          return new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject });
          })
            .then((token) => {
              originalRequest.headers.Authorization = `Bearer ${token}`;
              return axiosInstance(originalRequest);
            })
            .catch((err) => {
              return Promise.reject(err);
            });
        }

        originalRequest._retry = true;
        isRefreshing = true;

        const refreshToken = useAuthStore.getState().refreshToken;

        // If no refresh token is present, perform logout and redirect
        if (!refreshToken) {
          isRefreshing = false;
          useAuthStore.getState().logout();
          window.location.href = '/login';
          return Promise.reject(error);
        }

        try {
          // Use standard Axios for refreshing to avoid calling the interceptor recursively
          const response = await axios.post(
            `${axiosInstance.defaults.baseURL}${AUTH_ENDPOINTS.REFRESH}`,
            { refreshToken }
          );

          const { accessToken, refreshToken: newRefreshToken } = response.data;

          // Update tokens in store
          useAuthStore.getState().setTokens({
            accessToken,
            refreshToken: newRefreshToken || refreshToken,
          });

          // Resolve all queued requests with the new access token
          processQueue(null, accessToken);
          isRefreshing = false;

          // Retry the original request
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          return axiosInstance(originalRequest);
        } catch (refreshError) {
          // If token refresh fails, clear store, reject queued requests, and redirect to login
          processQueue(refreshError, null);
          isRefreshing = false;
          useAuthStore.getState().logout();
          window.location.href = '/login';
          return Promise.reject(refreshError);
        }
      }

      // Handle other common API status errors
      if (error.response) {
        switch (status) {
          case 400:
            console.error('Bad Request (400):', error.response.data);
            break;
          case 403:
            console.error('Forbidden (403): You do not have permissions for this action.');
            break;
          case 404:
            console.error('Not Found (404): The requested resource does not exist.');
            break;
          case 422:
            console.error('Validation Error (422):', error.response.data);
            break;
          case 500:
            console.error('Internal Server Error (500): Please try again later.');
            break;
          default:
            console.error(`API Error (${status}):`, error.response.data);
        }
      } else {
        console.error('Network or connection error:', error.message);
      }

      return Promise.reject(error);
    }
  );
};

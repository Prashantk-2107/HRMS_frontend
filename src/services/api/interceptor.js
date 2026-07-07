import axios from 'axios';
import { store } from '../../store';
import { logout, setTokens } from '../../store/slices/authslice.js';
import { AUTH_ENDPOINTS } from './endpoints.js';

let isRefreshing = false;
let failedQueue = [];

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

export const setupInterceptors = (axiosInstance) => {
  axiosInstance.interceptors.request.use(
    (config) => {
      const token = store.getState().auth.accessToken;
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;
      const status = error.response ? error.response.status : null;

      if (status === 401 && !originalRequest._retry) {
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

        const refreshToken = store.getState().auth.refreshToken;

        if (!refreshToken) {
          isRefreshing = false;
          store.dispatch(logout());
          return Promise.reject(error);
        }

        try {
          const response = await axios.post(
            `${axiosInstance.defaults.baseURL}${AUTH_ENDPOINTS.REFRESH}`,
            { refreshToken }
          );

          const { accessToken, refreshToken: newRefreshToken } = response.data;

          store.dispatch(setTokens({
            accessToken,
            refreshToken: newRefreshToken || refreshToken,
          }));

          processQueue(null, accessToken);
          isRefreshing = false;

          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          return axiosInstance(originalRequest);
        } catch (refreshError) {
          processQueue(refreshError, null);
          isRefreshing = false;
          store.dispatch(logout());
          return Promise.reject(refreshError);
        }
      }

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

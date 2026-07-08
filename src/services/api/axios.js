import axios from 'axios';
import toast from 'react-hot-toast';

const baseURL = import.meta.env.VITE_API_URL;
if (!baseURL) {
  console.warn("WARNING: VITE_API_URL is not defined in the environment variables. API requests may fail or fall back incorrectly.");
}

const apiInstance = axios.create({
  baseURL: baseURL || '/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

apiInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response.status === 429) {
      toast.error('Too many requests. Please try again later.');
    }
    return Promise.reject(error);
  }
)

export default apiInstance;

import axios from 'axios';
import toast from 'react-hot-toast';

// Dynamically determine the backend API URL based on the current hostname
const getBaseURL = () => {
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  const hostname = window.location.hostname;
  const protocol = window.location.protocol;
  // Default to port 5000 of the hostname that served the frontend
  return `${protocol}//${hostname}:5000/api/v1`;
};

const apiInstance = axios.create({
  baseURL: getBaseURL(),
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

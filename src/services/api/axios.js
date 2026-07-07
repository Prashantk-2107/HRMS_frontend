import axios from 'axios';
import toast from 'react-hot-toast';

const apiInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "https://worksphere-backend-36t4.onrender.com/api/v1",
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

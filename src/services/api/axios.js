import axios from 'axios';

// Create a reusable Axios instance
const apiInstance = axios.create({
  baseURL: 'http://localhost:5000/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

export default apiInstance;

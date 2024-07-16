import axios, { AxiosInstance } from 'axios';

const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL || '';
const timeout = parseInt(process.env.NEXT_PUBLIC_API_TIMEOUT || '10000', 10);
const token = process.env.NEXT_PUBLIC_AIRTABLE_TOKEN || '';
const axiosInstance: AxiosInstance = axios.create({
  baseURL,
  timeout,
  headers: { 'Content-Type': 'application/json' , 'Authorization': `Bearer ${token}`},
});

axiosInstance.interceptors.request.use(
  config => {
    // Add authorization token or other headers here if needed
    // const token = localStorage.getItem('token');
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// Response interceptor
axiosInstance.interceptors.response.use(
  response => response,
  error => {
    // Handle errors, log them, or show notifications
    return Promise.reject(error);
  }
);

export default axiosInstance;

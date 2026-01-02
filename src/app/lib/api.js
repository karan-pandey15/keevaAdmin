import axios from 'axios';

const api = axios.create({
  baseURL: 'https://api.keeva.in',
  timeout: 10000,
});

api.interceptors.request.use((config) => {
  try {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  } catch (error) {
    console.error('Error accessing localStorage:', error);
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      try {
        if (typeof window !== 'undefined') {
          localStorage.removeItem('token');
          window.location.href = '/login';
        }
      } catch (e) {
        console.error('Error handling 401 response:', e);
      }
    }
    return Promise.reject(error);
  }
);

export default api;

import axios from 'axios';

const api = axios.create({
  baseURL: '/api/v1',
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const currentPath = window.location.pathname;
    // Perbaikan: authPages tidak include '/' agar landing page tetap bisa diakses
    // Redirect 401 selalu ke /login
const authPages = ['/login', '/register', '/forgot-password', '/reset-password'];    const isAuthPage = authPages.some(p => currentPath.startsWith(p));

    if (status === 401 && !isAuthPage) {
      window.location.href = '/login';
      return Promise.reject(error);
    }

    if (!error.response) {
      error.message = 'Tidak dapat terhubung ke server. Periksa koneksi Anda.';
    }

    return Promise.reject(error);
  }
);

export default api;
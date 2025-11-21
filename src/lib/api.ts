import axios from 'axios';

/**
 * Axios instance configured for API requests
 * All requests are proxied through /api for security
 */
export const api = axios.create({
  baseURL: '/api',
});

/**
 * Response interceptor to handle errors consistently
 * Extracts error messages from API responses
 */
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const message =
      error.response?.data?.message || error.message || 'An error occurred';

    // Auto-logout on 401 Unauthorized
    if (error.response?.status === 401) {
      try {
        await fetch('/api/auth/logout', { method: 'POST' });
        window.location.href = '/';
        // Return a promise that never resolves to prevent error UI flash
        return new Promise(() => {});
      } catch (e) {
        console.error('Logout failed', e);
      }
    }

    return Promise.reject(new Error(message));
  },
);

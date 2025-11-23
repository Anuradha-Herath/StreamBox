import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { API_BASE_URL, API_KEY, DUMMY_API_BASE_URL, STORAGE_KEYS } from '../utils/constants';

// ==================== CONFIGURATION ====================
// Using DummyJSON API (https://dummyjson.com)
// Test Credentials:
//   Username: emilys, Password: emilyspass
//   Username: michaelw, Password: michaelwpass
//   ... and many more available at https://dummyjson.com/users
const BACKEND_API_URL = DUMMY_API_BASE_URL;

// Create axios instance for DummyJSON API
const apiClient = axios.create({
  baseURL: BACKEND_API_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Create axios instance for TMDB API
const tmdbClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    'Authorization': `Bearer ${API_KEY}`,
    'Content-Type': 'application/json',
  },
});

// Track token refresh to prevent multiple simultaneous refresh requests
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// ==================== REQUEST INTERCEPTOR ====================
// Automatically attach access token to all requests
apiClient.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ==================== RESPONSE INTERCEPTOR ====================
// Handle token refresh on 401 errors
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If error is 401 and we haven't already tried to refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // Queue request while token is being refreshed
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(token => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return apiClient(originalRequest);
          })
          .catch(err => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshToken = await AsyncStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
        
        if (!refreshToken) {
          throw new Error('No refresh token available');
        }

        // Call DummyJSON refresh token endpoint
        const response = await axios.post(
          `${BACKEND_API_URL}/auth/refresh`,
          { refreshToken, expiresInMins: 30 },
          { timeout: 10000 }
        );

        const { accessToken, refreshToken: newRefreshToken } = response.data;

        // Save new tokens
        await AsyncStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, accessToken);
        if (newRefreshToken) {
          await AsyncStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, newRefreshToken);
        }

        // Update authorization header
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        
        // Process queued requests
        processQueue(null, accessToken);
        
        // Retry original request
        return apiClient(originalRequest);
      } catch (err) {
        // Clear tokens if refresh fails
        await AsyncStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
        await AsyncStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
        
        processQueue(err, null);
        
        // Redirect to login by throwing specific error
        const error = new Error('Session expired. Please login again.');
        error.code = 'SESSION_EXPIRED';
        throw error;
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

// ==================== AUTHENTICATION SERVICE ====================
/**
 * Authentication service using DummyJSON API
 * 
 * Test Users Available:
 * - emilys / emilyspass
 * - michaelw / michaelwpass
 * - harryp / harryppass
 * And many more: https://dummyjson.com/users
 */
export const authService = {
  /**
   * Login with username and password (DummyJSON expects username, not email)
   * DummyJSON returns: { accessToken, refreshToken, id, username, email, firstName, lastName, ... }
   */
  login: async (email, password) => {
    try {
      // DummyJSON login endpoint expects 'username' parameter
      // We use email as username (or could use actual username)
      const response = await apiClient.post('/auth/login', {
        username: email, // DummyJSON uses 'username' field
        password: password,
        expiresInMins: 30, // Optional: set token expiration
      });

      const { accessToken, refreshToken, id, username, email: userEmail, firstName, lastName } = response.data;

      // Save tokens
      await AsyncStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, accessToken);
      if (refreshToken) {
        await AsyncStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, refreshToken);
      }

      return {
        token: accessToken,
        refreshToken,
        user: {
          id,
          username: username || email,
          email: userEmail || email,
          firstName: firstName || username || 'User',
          lastName: lastName || '',
          avatar: null,
        },
      };
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Login failed';
      const apiError = new Error(message);
      apiError.code = error.response?.data?.code || 'LOGIN_ERROR';
      apiError.errors = error.response?.data?.errors;
      throw apiError;
    }
  },

  /**
   * Register new user
   * Note: DummyJSON doesn't have a real register endpoint for demo purposes
   * This is a mock implementation - for production, use a real backend
   */
  register: async (username, email, password) => {
    try {
      // DummyJSON doesn't have a real registration endpoint
      // This is a mock response for demo purposes
      const mockUser = {
        id: Math.floor(Math.random() * 10000),
        username,
        email,
        firstName: username.split(' ')[0] || username,
        lastName: username.split(' ')[1] || '',
      };

      // Create mock tokens (for demo only - real backend would generate these)
      const mockAccessToken = `mock-access-token-${Date.now()}`;
      const mockRefreshToken = `mock-refresh-token-${Date.now()}`;

      await AsyncStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, mockAccessToken);
      await AsyncStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, mockRefreshToken);

      return {
        token: mockAccessToken,
        refreshToken: mockRefreshToken,
        user: mockUser,
      };
    } catch (error) {
      const message = error.message || 'Registration failed';
      const apiError = new Error(message);
      apiError.code = 'REGISTER_ERROR';
      throw apiError;
    }
  },

  /**
   * Get current authenticated user profile
   * Uses the access token from Authorization header
   */
  getProfile: async () => {
    try {
      const response = await apiClient.get('/auth/me');
      return {
        id: response.data.id,
        username: response.data.username,
        email: response.data.email,
        firstName: response.data.firstName,
        lastName: response.data.lastName,
        avatar: response.data.image || null,
      };
    } catch (error) {
      console.error('Get profile error:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Failed to fetch profile');
    }
  },

  /**
   * Update user profile
   * Note: DummyJSON may not support profile updates in demo mode
   */
  updateProfile: async (userData) => {
    try {
      const response = await apiClient.put(`/users/${userData.id}`, userData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to update profile');
    }
  },

  /**
   * Logout user
   * Clears tokens from local storage
   */
  logout: async () => {
    try {
      // DummyJSON doesn't have a logout endpoint, so we just clear local tokens
      await AsyncStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
      await AsyncStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
      await AsyncStorage.removeItem(STORAGE_KEYS.USER_DATA);
    } catch (error) {
      console.warn('Logout failed:', error.message);
      // Continue with logout even if there's an error
      await AsyncStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
      await AsyncStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
      await AsyncStorage.removeItem(STORAGE_KEYS.USER_DATA);
    }
  },

  /**
   * Verify email (Optional - DummyJSON doesn't support this)
   */
  verifyEmail: async (token) => {
    throw new Error('Email verification not available with DummyJSON');
  },

  /**
   * Request password reset (Optional - DummyJSON doesn't support this)
   */
  requestPasswordReset: async (email) => {
    throw new Error('Password reset not available with DummyJSON');
  },

  /**
   * Reset password (Optional - DummyJSON doesn't support this)
   */
  resetPassword: async (token, newPassword) => {
    throw new Error('Password reset not available with DummyJSON');
  },
};

// Movie Service
export const movieService = {
  // Fetch trending movies from TMDB API
  getTrendingMovies: async () => {
    try {
      const response = await tmdbClient.get('/trending/movie/week');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.status_message || 'Failed to fetch trending movies');
    }
  },

  // Fetch movie details
  getMovieDetails: async (movieId) => {
    try {
      const response = await tmdbClient.get(`/movie/${movieId}`, {
        params: {
          append_to_response: 'credits',
        },
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.status_message || 'Failed to fetch movie details');
    }
  },

  // Fetch similar movies
  getSimilarMovies: async (movieId) => {
    try {
      const response = await tmdbClient.get(`/movie/${movieId}/similar`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.status_message || 'Failed to fetch similar movies');
    }
  },

  // Search movies
  searchMovies: async (query) => {
    try {
      const response = await tmdbClient.get('/search/movie', {
        params: {
          query: query,
        },
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.status_message || 'Failed to search movies');
    }
  },
};

export default apiClient;

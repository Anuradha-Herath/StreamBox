import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { DUMMY_API_BASE_URL, STORAGE_KEYS } from '../utils/constants';

// ==================== CONFIGURATION ====================
// Replace this with your real backend API endpoint
// Example: 'https://your-backend.com/api'
const BACKEND_API_URL = process.env.REACT_APP_API_URL || DUMMY_API_BASE_URL;

// Create axios instance with real backend
const apiClient = axios.create({
  baseURL: BACKEND_API_URL,
  timeout: 15000,
  headers: {
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
// Automatically attach token to all requests
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

        // Call refresh token endpoint on your backend
        const response = await axios.post(
          `${BACKEND_API_URL}/auth/refresh`,
          { refreshToken },
          { timeout: 10000 }
        );

        const { token, refreshToken: newRefreshToken } = response.data;

        // Save new tokens
        await AsyncStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
        if (newRefreshToken) {
          await AsyncStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, newRefreshToken);
        }

        // Update authorization header
        originalRequest.headers.Authorization = `Bearer ${token}`;
        
        // Process queued requests
        processQueue(null, token);
        
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
export const authService = {
  /**
   * Login with email and password
   * Backend should return: { token, refreshToken, user }
   */
  login: async (email, password) => {
    try {
      const response = await apiClient.post('/auth/login', {
        email,
        password,
      });

      const { token, refreshToken, user } = response.data;

      // Save tokens
      await AsyncStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
      if (refreshToken) {
        await AsyncStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, refreshToken);
      }

      return {
        token,
        refreshToken,
        user,
      };
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Login failed';
      const apiError = new Error(message);
      apiError.code = error.response?.data?.code || 'LOGIN_ERROR';
      apiError.errors = error.response?.data?.errors; // Field-specific errors
      throw apiError;
    }
  },

  /**
   * Register new user
   * Backend should return: { token, refreshToken, user }
   */
  register: async (username, email, password) => {
    try {
      const response = await apiClient.post('/auth/register', {
        username,
        email,
        password,
      });

      const { token, refreshToken, user } = response.data;

      // Save tokens
      await AsyncStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
      if (refreshToken) {
        await AsyncStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, refreshToken);
      }

      return {
        token,
        refreshToken,
        user,
      };
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Registration failed';
      const apiError = new Error(message);
      apiError.code = error.response?.data?.code || 'REGISTER_ERROR';
      apiError.errors = error.response?.data?.errors; // Field-specific errors
      throw apiError;
    }
  },

  /**
   * Verify email (optional - for email confirmation flow)
   */
  verifyEmail: async (token) => {
    try {
      const response = await apiClient.post('/auth/verify-email', { token });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Email verification failed');
    }
  },

  /**
   * Request password reset
   */
  requestPasswordReset: async (email) => {
    try {
      const response = await apiClient.post('/auth/forgot-password', { email });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Password reset request failed');
    }
  },

  /**
   * Reset password with token
   */
  resetPassword: async (token, newPassword) => {
    try {
      const response = await apiClient.post('/auth/reset-password', {
        token,
        newPassword,
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Password reset failed');
    }
  },

  /**
   * Logout user
   */
  logout: async () => {
    try {
      // Call logout endpoint to invalidate token on backend
      await apiClient.post('/auth/logout');
    } catch (error) {
      console.warn('Logout API call failed:', error.message);
      // Continue with local logout even if API call fails
    } finally {
      // Clear local storage
      await AsyncStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
      await AsyncStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
      await AsyncStorage.removeItem(STORAGE_KEYS.USER_DATA);
    }
  },

  /**
   * Get current user profile
   */
  getProfile: async () => {
    try {
      const response = await apiClient.get('/auth/profile');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch profile');
    }
  },

  /**
   * Update user profile
   */
  updateProfile: async (userData) => {
    try {
      const response = await apiClient.put('/auth/profile', userData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to update profile');
    }
  },
};

// Movie Service
export const movieService = {
  // Fetch trending movies from mock API
  getTrendingMovies: async () => {
    try {
      // Using JSONPlaceholder as dummy data source
      // In production, integrate with The Movie Database API
      const movies = [
        {
          id: 1,
          title: 'Inception',
          poster_path: 'https://via.placeholder.com/300x450?text=Inception',
          overview: 'A skilled thief who steals corporate secrets through dream-sharing technology.',
          vote_average: 8.8,
          release_date: '2010-07-16',
          genre_ids: [28, 12, 35],
        },
        {
          id: 2,
          title: 'The Dark Knight',
          poster_path: 'https://via.placeholder.com/300x450?text=The+Dark+Knight',
          overview: 'When the menace known as The Joker emerges from his mysterious past.',
          vote_average: 9.0,
          release_date: '2008-07-18',
          genre_ids: [28, 80, 18],
        },
        {
          id: 3,
          title: 'Interstellar',
          poster_path: 'https://via.placeholder.com/300x450?text=Interstellar',
          overview: 'A team of explorers travel through a wormhole in space in an attempt to ensure humanity\'s survival.',
          vote_average: 8.6,
          release_date: '2014-11-07',
          genre_ids: [12, 18, 878],
        },
        {
          id: 4,
          title: 'Pulp Fiction',
          poster_path: 'https://via.placeholder.com/300x450?text=Pulp+Fiction',
          overview: 'The lives of two mob hitmen, a boxer, a gangster and his wife intertwine in four tales of violence.',
          vote_average: 8.9,
          release_date: '1994-10-14',
          genre_ids: [80, 53],
        },
        {
          id: 5,
          title: 'The Shawshank Redemption',
          poster_path: 'https://via.placeholder.com/300x450?text=Shawshank',
          overview: 'Two imprisoned men bond over a number of years, finding solace and eventual redemption.',
          vote_average: 9.3,
          release_date: '1994-09-23',
          genre_ids: [18, 80],
        },
        {
          id: 6,
          title: 'Forrest Gump',
          poster_path: 'https://via.placeholder.com/300x450?text=Forrest+Gump',
          overview: 'The presidencies of Kennedy and Johnson unfold through the perspective of an Alabama man.',
          vote_average: 8.8,
          release_date: '1994-07-06',
          genre_ids: [35, 18],
        },
      ];
      return { results: movies };
    } catch (error) {
      throw new Error('Failed to fetch movies');
    }
  },

  // Fetch movie details
  getMovieDetails: async (movieId) => {
    try {
      const movies = [
        {
          id: 1,
          title: 'Inception',
          poster_path: 'https://via.placeholder.com/300x450?text=Inception',
          overview: 'A skilled thief who steals corporate secrets through dream-sharing technology is given the inverse task of planting an idea.',
          vote_average: 8.8,
          release_date: '2010-07-16',
          genres: ['Action', 'Sci-Fi', 'Thriller'],
          runtime: 148,
          budget: 160000000,
          revenue: 839000000,
          cast: [
            { name: 'Leonardo DiCaprio', character: 'Cobb' },
            { name: 'Marion Cotillard', character: 'Mal' },
            { name: 'Ellen Page', character: 'Ariadne' },
          ],
        },
        {
          id: 2,
          title: 'The Dark Knight',
          poster_path: 'https://via.placeholder.com/300x450?text=The+Dark+Knight',
          overview: 'When the menace known as The Joker wreaks havoc on Gotham.',
          vote_average: 9.0,
          release_date: '2008-07-18',
          genres: ['Action', 'Crime', 'Drama'],
          runtime: 152,
          budget: 185000000,
          revenue: 1005000000,
          cast: [
            { name: 'Christian Bale', character: 'Batman' },
            { name: 'Heath Ledger', character: 'Joker' },
          ],
        },
      ];

      return movies.find(m => m.id === movieId) || movies[0];
    } catch (error) {
      throw new Error('Failed to fetch movie details');
    }
  },

  // Search movies
  searchMovies: async (query) => {
    try {
      const allMovies = [
        {
          id: 1,
          title: 'Inception',
          poster_path: 'https://via.placeholder.com/300x450?text=Inception',
          overview: 'A skilled thief who steals corporate secrets through dream-sharing technology.',
          vote_average: 8.8,
          release_date: '2010-07-16',
        },
        {
          id: 2,
          title: 'The Dark Knight',
          poster_path: 'https://via.placeholder.com/300x450?text=The+Dark+Knight',
          overview: 'When the menace known as The Joker emerges from his mysterious past.',
          vote_average: 9.0,
          release_date: '2008-07-18',
        },
      ];

      const filtered = allMovies.filter(
        movie =>
          movie.title.toLowerCase().includes(query.toLowerCase()) ||
          movie.overview.toLowerCase().includes(query.toLowerCase())
      );

      return { results: filtered };
    } catch (error) {
      throw new Error('Failed to search movies');
    }
  },
};

export default apiClient;

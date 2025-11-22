import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { API_BASE_URL, API_KEY, DUMMY_API_BASE_URL, STORAGE_KEYS } from '../utils/constants';

// Create axios instance for dummy API
const apiClient = axios.create({
  baseURL: DUMMY_API_BASE_URL,
  timeout: 10000,
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

// Add request interceptor
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

// Authentication Service
export const authService = {
  // Dummy login - in production, send to real backend
  login: async (email, password) => {
    try {
      // Simulate API call with dummy data
      const response = await apiClient.post('/auth/login', {
        username: email,
        password: password,
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Login failed');
    }
  },

  // Dummy register
  register: async (username, email, password) => {
    try {
      const response = await apiClient.post('/users/add', {
        firstName: username.split(' ')[0] || username,
        lastName: username.split(' ')[1] || '',
        email: email,
        password: password,
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Registration failed');
    }
  },

  logout: async () => {
    try {
      await AsyncStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
      await AsyncStorage.removeItem(STORAGE_KEYS.USER_DATA);
      return true;
    } catch (error) {
      throw new Error('Logout failed');
    }
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

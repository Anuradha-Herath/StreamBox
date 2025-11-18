import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { DUMMY_API_BASE_URL, STORAGE_KEYS } from '../utils/constants';

// Create axios instance for dummy API
const apiClient = axios.create({
  baseURL: DUMMY_API_BASE_URL,
  timeout: 10000,
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

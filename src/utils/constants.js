export const API_BASE_URL = 'https://api.themoviedb.org/3';
export const API_KEY = 'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI2YmY0ZDI0YzJiOTgyMzVmYzJlYjRhODM3ZDc5ZGQwYSIsInN1YiI6IjY3MzhhMWI4YzI0OTU1ZGFmYzk2OTk1NyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.ALh6CbvZS_NVPg51HXFqGQBJ5cWsV9wMeYwv5F7VBNs';
export const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w342';
export const POSTER_BASE_URL = 'https://image.tmdb.org/t/p/w500';

// Dummy API endpoints
export const DUMMY_API_BASE_URL = 'https://dummyjson.com';

export const STORAGE_KEYS = {
  AUTH_TOKEN: '@streambox_auth_token',
  USER_DATA: '@streambox_user_data',
  FAVORITES: '@streambox_favorites',
  THEME_MODE: '@streambox_theme_mode',
};

export const ENDPOINTS = {
  LOGIN: '/auth/login',
  REGISTER: '/users/add',
  TRENDING_MOVIES: '/movie/trending',
  SEARCH_MOVIES: '/search/movie',
  MOVIE_DETAILS: '/movie/:id',
};

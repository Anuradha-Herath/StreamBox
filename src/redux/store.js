import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import moviesReducer from './moviesSlice';
import favoritesReducer from './favoritesSlice';
import themeReducer from './themeSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    movies: moviesReducer,
    favorites: favoritesReducer,
    theme: themeReducer,
  },
});

export default store;

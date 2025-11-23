import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import favoritesReducer from './favoritesSlice';
import moviesReducer from './moviesSlice';
import themeReducer from './themeSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    movies: moviesReducer,
    favorites: favoritesReducer,
    theme: themeReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export default store;

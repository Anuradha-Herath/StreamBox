import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  movies: [],
  isLoading: false,
  error: null,
};

const moviesSlice = createSlice({
  name: 'movies',
  initialState,
  reducers: {
    fetchMoviesStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    fetchMoviesSuccess: (state, action) => {
      state.isLoading = false;
      state.movies = action.payload;
      state.error = null;
    },
    fetchMoviesAppend: (state, action) => {
      state.isLoading = false;
      state.movies = [...state.movies, ...action.payload];
      state.error = null;
    },
    fetchMoviesFailure: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    setMovies: (state, action) => {
      state.movies = action.payload;
    },
  },
});

export const {
  fetchMoviesStart,
  fetchMoviesSuccess,
  fetchMoviesAppend,
  fetchMoviesFailure,
  setMovies,
} = moviesSlice.actions;

export default moviesSlice.reducer;

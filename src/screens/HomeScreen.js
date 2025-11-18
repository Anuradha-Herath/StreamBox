import React, { useEffect, useState } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  Alert,
  SafeAreaView,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Header from '../components/Header';
import MovieCard from '../components/MovieCard';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorBanner from '../components/ErrorBanner';
import SearchBar from '../components/SearchBar';
import { movieService } from '../services/api';
import { fetchMoviesStart, fetchMoviesSuccess, fetchMoviesFailure } from '../redux/moviesSlice';
import { setFavorites, addFavorite, removeFavorite } from '../redux/favoritesSlice';
import { toggleTheme } from '../redux/themeSlice';
import { logout } from '../redux/authSlice';
import { STORAGE_KEYS } from '../utils/constants';
import { getTheme } from '../styles/theme';

const HomeScreen = ({ navigation, isDarkMode }) => {
  const dispatch = useDispatch();
  const { movies, isLoading, error } = useSelector(state => state.movies);
  const { favorites } = useSelector(state => state.favorites);
  const { user } = useSelector(state => state.auth);
  const [filteredMovies, setFilteredMovies] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const theme = getTheme(isDarkMode);

  useEffect(() => {
    loadMovies();
    loadFavorites();
  }, []);

  useEffect(() => {
    filterMovies();
  }, [movies, searchQuery]);

  const loadMovies = async () => {
    try {
      dispatch(fetchMoviesStart());
      const data = await movieService.getTrendingMovies();
      dispatch(fetchMoviesSuccess(data.results));
    } catch (err) {
      dispatch(fetchMoviesFailure(err.message));
    }
  };

  const loadFavorites = async () => {
    try {
      const savedFavorites = await AsyncStorage.getItem(STORAGE_KEYS.FAVORITES);
      if (savedFavorites) {
        dispatch(setFavorites(JSON.parse(savedFavorites)));
      }
    } catch (error) {
      console.error('Failed to load favorites:', error);
    }
  };

  const filterMovies = () => {
    if (searchQuery.trim() === '') {
      setFilteredMovies(movies);
    } else {
      const filtered = movies.filter(
        movie =>
          movie.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          movie.overview.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredMovies(filtered);
    }
  };

  const handleMoviePress = (movie) => {
    navigation.navigate('MovieDetails', { movie });
  };

  const handleFavoritePress = async (movie) => {
    try {
      const isFavorite = favorites.find(fav => fav.id === movie.id);

      if (isFavorite) {
        dispatch(removeFavorite(movie.id));
      } else {
        dispatch(addFavorite(movie));
      }

      // Persist to storage
      const updatedFavorites = isFavorite
        ? favorites.filter(fav => fav.id !== movie.id)
        : [...favorites, movie];

      await AsyncStorage.setItem(
        STORAGE_KEYS.FAVORITES,
        JSON.stringify(updatedFavorites)
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to update favorites');
    }
  };

  const handleMenuPress = () => {
    Alert.alert('Menu', 'Navigation menu options', [
      { text: 'Profile', onPress: () => navigation.navigate('Profile') },
      { text: 'Favorites', onPress: () => navigation.navigate('Favorites') },
      { text: 'Settings', onPress: () => navigation.navigate('Settings') },
      { text: 'Logout', onPress: handleLogout },
      { text: 'Cancel', style: 'cancel' },
    ]);
  };

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
      await AsyncStorage.removeItem(STORAGE_KEYS.USER_DATA);
      dispatch(logout());
    } catch (error) {
      Alert.alert('Error', 'Failed to logout');
    }
  };

  const handleThemeToggle = async () => {
    dispatch(toggleTheme());
    await AsyncStorage.setItem(STORAGE_KEYS.THEME_MODE, JSON.stringify(!isDarkMode));
  };

  const renderMovieItem = ({ item }) => (
    <MovieCard
      movie={item}
      isDarkMode={isDarkMode}
      onPress={() => handleMoviePress(item)}
      onFavoritePress={() => handleFavoritePress(item)}
      isFavorite={favorites.some(fav => fav.id === item.id)}
    />
  );

  if (isLoading && movies.length === 0) {
    return <LoadingSpinner isDarkMode={isDarkMode} message="Loading movies..." />;
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <Header
        isDarkMode={isDarkMode}
        onMenuPress={handleMenuPress}
        onThemeToggle={handleThemeToggle}
        username={user?.firstName || user?.username}
      />

      <SearchBar
        isDarkMode={isDarkMode}
        onSearch={setSearchQuery}
        placeholder="Search movies..."
      />

      {error && (
        <ErrorBanner
          isDarkMode={isDarkMode}
          message={error}
          onRetry={loadMovies}
        />
      )}

      <FlatList
        data={filteredMovies}
        renderItem={renderMovieItem}
        keyExtractor={item => item.id.toString()}
        scrollEnabled={true}
        contentContainerStyle={styles.listContent}
        onEndReachedThreshold={0.5}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContent: {
    paddingBottom: 20,
  },
});

export default HomeScreen;

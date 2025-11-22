import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect } from 'react';
import {
  Alert,
  FlatList,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import Header from '../components/Header';
import MovieCard from '../components/MovieCard';
import { removeFavorite, setFavorites } from '../redux/favoritesSlice';
import { toggleTheme } from '../redux/themeSlice';
import { getTheme } from '../styles/theme';
import { STORAGE_KEYS } from '../utils/constants';

const FavoritesScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { favorites } = useSelector(state => state.favorites);
  const isDarkMode = useSelector(state => state.theme.isDarkMode);
  const theme = getTheme(isDarkMode);

  useEffect(() => {
    loadFavorites();
  }, []);

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

  const handleMoviePress = (movie) => {
    navigation.navigate('MovieDetails', { movie });
  };

  const handleRemoveFavorite = async (movieId) => {
    try {
      dispatch(removeFavorite(movieId));
      const updatedFavorites = favorites.filter(fav => fav.id !== movieId);
      await AsyncStorage.setItem(
        STORAGE_KEYS.FAVORITES,
        JSON.stringify(updatedFavorites)
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to remove from favorites');
    }
  };

  const handleMenuPress = () => {
    Alert.alert('Menu', 'Navigation menu options', [
      { text: 'Home', onPress: () => navigation.navigate('HomeTab') },
      { text: 'Profile', onPress: () => navigation.navigate('ProfileTab') },
      { text: 'Settings', onPress: () => navigation.navigate('SettingsTab') },
      { text: 'Cancel', style: 'cancel' },
    ]);
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
      onFavoritePress={() => handleRemoveFavorite(item.id)}
      isFavorite={true}
    />
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <Header
        isDarkMode={isDarkMode}
        onMenuPress={handleMenuPress}
        onThemeToggle={handleThemeToggle}
        title="Favorites"
      />

      {favorites.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={[styles.emptyIcon, { color: theme.primary }]}>❤️</Text>
          <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
            No favorites yet
          </Text>
          <Text style={[styles.emptySubtext, { color: theme.textSecondary }]}>
            Mark your favorite movies to see them here
          </Text>
        </View>
      ) : (
        <FlatList
          data={favorites}
          renderItem={renderMovieItem}
          keyExtractor={item => item.id.toString()}
          scrollEnabled={true}
          contentContainerStyle={styles.listContent}
        />
      )}
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
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyIcon: {
    fontSize: 60,
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
  },
});

export default FavoritesScreen;

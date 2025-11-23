import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCallback, useEffect, useState } from 'react';
import {
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import Modal from 'react-native-modal';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import BottomNav from '../components/BottomNav';
import ErrorBanner from '../components/ErrorBanner';
import LoadingSpinner from '../components/LoadingSpinner';
import MovieCard from '../components/MovieCard';
import { logout } from '../redux/authSlice';
import { addFavorite, removeFavorite, setFavorites } from '../redux/favoritesSlice';
import { fetchMoviesAppend, fetchMoviesFailure, fetchMoviesStart, fetchMoviesSuccess } from '../redux/moviesSlice';
import { toggleTheme } from '../redux/themeSlice';
import { movieService } from '../services/api';
import { getTheme } from '../styles/theme';
import { STORAGE_KEYS } from '../utils/constants';

const HomeScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { movies, isLoading, error } = useSelector(state => state.movies);
  const { favorites } = useSelector(state => state.favorites);
  const { user } = useSelector(state => state.auth);
  const isDarkMode = useSelector(state => state.theme.isDarkMode);
  const [filteredMovies, setFilteredMovies] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const theme = getTheme(isDarkMode);

  useEffect(() => {
    loadMovies();
    loadFavorites();
  }, []);

  useEffect(() => {
    filterMovies();
  }, [movies, searchQuery]);

  const loadMovies = async (page = 1) => {
    try {
      if (page === 1) {
        dispatch(fetchMoviesStart());
      } else {
        setIsLoadingMore(true);
      }
      const data = await movieService.getTrendingMovies(page);
      if (page === 1) {
        dispatch(fetchMoviesSuccess(data.results));
      } else {
        dispatch(fetchMoviesAppend(data.results));
      }
    } catch (err) {
      dispatch(fetchMoviesFailure(err.message));
    } finally {
      setIsLoadingMore(false);
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
    setIsMenuVisible(true);
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

  const renderMovieItem = useCallback(({ item }) => (
    <MovieCard
      movie={item}
      isDarkMode={isDarkMode}
      onPress={() => handleMoviePress(item)}
      onFavoritePress={() => handleFavoritePress(item)}
      isFavorite={favorites.some(fav => fav.id === item.id)}
    />
  ), [isDarkMode, favorites, handleMoviePress, handleFavoritePress]);

  if (isLoading && movies.length === 0) {
    return <LoadingSpinner isDarkMode={isDarkMode} message="Loading movies..." />;
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Header Section */}
      <View style={styles.header}>
        {/* Background Gradient Accent */}
        <View style={styles.headerGradient} />

        <View style={styles.headerContent}>
          {/* Top Row - Greeting & Actions */}
          <View style={styles.headerTopRow}>
            <View style={styles.profileSection}>
              <View style={styles.avatarContainer}>
                <View style={[styles.avatar, { backgroundColor: theme.primary }]}>
                  <Text style={styles.avatarText}>
                    {user?.username?.charAt(0)?.toUpperCase() || 'U'}
                  </Text>
                </View>
              </View>
              <View style={styles.greetingSection}>
                <View style={styles.greetingRow}>
                  <Ionicons name="star" size={14} color={theme.textSecondary} />
                  <Text style={[styles.greetingText, { color: theme.textSecondary }]}>Hello,</Text>
                </View>
                <Text style={[styles.userName, { color: theme.text }]}>
                  {user?.username || 'User'}
                </Text>
              </View>
            </View>

            {/* Action Buttons */}
            <View style={styles.actionButtons}>
              <TouchableOpacity style={styles.notificationButton}>
                <Ionicons name="notifications-outline" size={20} color={theme.textSecondary} />
                {/* Notification Badge */}
                <View style={styles.notificationBadge}>
                  <Text style={styles.badgeText}>3</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>

          {/* Search Bar */}
          <View style={styles.searchContainer}>
            <View style={styles.searchIconContainer}>
              <Ionicons name="search" size={20} color={theme.textSecondary} />
            </View>
            <TextInput
              style={[styles.searchInput, { color: theme.text, backgroundColor: theme.surface, borderColor: theme.border }]}
              placeholder="Search movies, shows, podcasts..."
              placeholderTextColor={theme.textSecondary}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
        </View>
      </View>

      {/* Main Content */}
      <View style={styles.mainContent}>
        {/* Section Title */}
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Trending Now</Text>
          <View style={styles.titleUnderline} />
        </View>

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
          keyExtractor={(item, index) => item.id.toString() + '-' + index.toString()}
          numColumns={2}
          initialNumToRender={6}
          maxToRenderPerBatch={4}
          windowSize={5}
          removeClippedSubviews={true}
          scrollEnabled={true}
          contentContainerStyle={styles.gridContainer}
          onEndReached={() => {
            if (!isLoadingMore && movies.length > 0) {
              const nextPage = currentPage + 1;
              setCurrentPage(nextPage);
              loadMovies(nextPage);
            }
          }}
          onEndReachedThreshold={0.5}
          ListEmptyComponent={
            !isLoading && (
              <View style={styles.emptyContainer}>
                <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
                  No movies found
                </Text>
              </View>
            )
          }
        />
      </View>

      <Modal
        isVisible={isMenuVisible}
        onBackdropPress={() => setIsMenuVisible(false)}
        animationIn="slideInUp"
        animationOut="slideOutDown"
        backdropOpacity={0.3}
        style={{ justifyContent: 'flex-end', margin: 0 }}
      >
        <View style={[styles.bottomSheet, { backgroundColor: theme.surface }]}>
          <Text style={[styles.sheetTitle, { color: theme.text }]}>Menu</Text>
          <TouchableOpacity
            style={[styles.menuItem, { borderBottomColor: theme.border }]}
            onPress={() => {
              setIsMenuVisible(false);
              navigation.navigate('ProfileTab');
            }}
          >
            <Text style={{ color: theme.text }}>Profile</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.menuItem, { borderBottomColor: theme.border }]}
            onPress={() => {
              setIsMenuVisible(false);
              navigation.navigate('FavoritesTab');
            }}
          >
            <Text style={{ color: theme.text }}>Favorites</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.menuItem, { borderBottomColor: theme.border }]}
            onPress={() => {
              setIsMenuVisible(false);
              navigation.navigate('SettingsTab');
            }}
          >
            <Text style={{ color: theme.text }}>Settings</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.menuItem, { borderBottomColor: theme.border }]}
            onPress={() => {
              setIsMenuVisible(false);
              handleLogout();
            }}
          >
            <Text style={{ color: theme.error }}>Logout</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={() => setIsMenuVisible(false)}
          >
            <Text style={{ color: theme.textSecondary }}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </Modal>
      <BottomNav navigation={navigation} currentRoute="HomeTab" />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 24,
    position: 'relative',
    overflow: 'hidden',
  },
  headerGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 160,
    backgroundColor: 'rgba(147, 51, 234, 0.1)',
  },
  headerContent: {
    position: 'relative',
  },
  headerTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    marginRight: 12,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(147, 51, 234, 0.5)',
  },
  avatarText: {
    color: '#FFF',
    fontSize: 20,
    fontWeight: '700',
  },
  greetingSection: {},
  greetingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  greetingText: {
    fontSize: 14,
    marginLeft: 6,
  },
  userName: {
    fontSize: 18,
    fontWeight: '600',
  },
  actionButtons: {
    flexDirection: 'row',
  },
  notificationButton: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: 'rgba(17, 24, 39, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  notificationBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#9333EA',
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: '600',
  },
  searchContainer: {
    position: 'relative',
  },
  searchIconContainer: {
    position: 'absolute',
    left: 16,
    top: '50%',
    transform: [{ translateY: -10 }],
    zIndex: 1,
  },
  searchInput: {
    width: '100%',
    paddingLeft: 52,
    paddingRight: 16,
    paddingVertical: 16,
    borderRadius: 16,
    borderWidth: 1,
    fontSize: 16,
  },
  mainContent: {
    flex: 1,
    paddingHorizontal: 24,
  },
  sectionHeader: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 8,
  },
  titleUnderline: {
    width: 64,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#9333EA',
  },
  gridContainer: {
    paddingBottom: 120,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 16,
  },
  bottomSheet: {
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '50%',
  },
  sheetTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  menuItem: {
    paddingVertical: 15,
    borderBottomWidth: 1,
  },
  cancelButton: {
    marginTop: 15,
    alignSelf: 'center',
    paddingVertical: 10,
  },
});

export default HomeScreen;

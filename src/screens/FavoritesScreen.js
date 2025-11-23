import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect } from 'react';
import {
    Alert,
    FlatList,
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { Heart } from 'react-native-feather';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import BottomNav from '../components/BottomNav';
import { removeFavorite, setFavorites } from '../redux/favoritesSlice';
import { getTheme } from '../styles/theme';
import { POSTER_BASE_URL, STORAGE_KEYS } from '../utils/constants';

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

  const renderMovieItem = ({ item }) => (
    <View style={[styles.favoriteItem, { borderColor: theme.border, backgroundColor: isDarkMode ? 'rgba(17, 24, 39, 0.5)' : theme.surface }]}>
      <TouchableOpacity
        style={styles.thumbnailContainer}
        onPress={() => handleMoviePress(item)}
      >
        <Image
          source={{ uri: POSTER_BASE_URL + item.poster_path }}
          style={styles.thumbnail}
        />
        <View style={styles.thumbnailOverlay} />
      </TouchableOpacity>

      <View style={styles.contentInfo}>
        <TouchableOpacity onPress={() => handleMoviePress(item)}>
          <Text style={[styles.title, { color: theme.text }]} numberOfLines={2}>
            {item.title}
          </Text>
        </TouchableOpacity>

        <View style={styles.statusBadge}>
          <Text style={styles.statusText}>Popular</Text>
        </View>

        <Text style={[styles.genre, { color: theme.textSecondary }]}>
          {item.genres ? item.genres.map(g => g.name).join(', ') : 'Unknown'}
        </Text>
        <Text style={[styles.duration, { color: theme.textSecondary }]}>
          {item.runtime ? `${Math.floor(item.runtime / 60)}h ${item.runtime % 60}m` : 'Unknown'}
        </Text>

        <View style={styles.ratingContainer}>
          <Heart width={16} height={16} stroke="#9333EA" fill="#9333EA" />
          <Text style={[styles.rating, { color: theme.primary }]}>
            {item.vote_average?.toFixed(1) || 'N/A'}
          </Text>
        </View>
      </View>

      <TouchableOpacity
        style={styles.removeButton}
        onPress={() => handleRemoveFavorite(item.id)}
      >
        <Text style={styles.removeIcon}>✕</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Header Section */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <Text style={[styles.headerTitle, { color: theme.text }]}>My Favorites</Text>
          <View style={styles.countBadge}>
            <Text style={styles.countText}>
              {favorites.length} {favorites.length === 1 ? 'item' : 'items'}
            </Text>
          </View>
        </View>
        <Text style={[styles.headerSubtitle, { color: theme.textSecondary }]}>
          Your curated collection
        </Text>
      </View>

      {/* Main Content */}
      {favorites.length === 0 ? (
        <View style={styles.emptyContainer}>
          <View style={styles.emptyIconContainer}>
            <Heart width={96} height={96} stroke="#374151" />
          </View>
          <Text style={[styles.emptyTitle, { color: theme.text }]}>No Favorites Yet</Text>
          <Text style={[styles.emptySubtitle, { color: theme.textSecondary }]}>
            Start building your collection by adding movies and shows you love
          </Text>
          <TouchableOpacity
            style={styles.exploreButton}
            onPress={() => navigation.navigate('HomeTab')}
          >
            <Text style={styles.exploreButtonText}>Explore Content</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={favorites}
          renderItem={renderMovieItem}
          keyExtractor={item => item.id.toString()}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      )}
      <BottomNav navigation={navigation} currentRoute="FavoritesTab" />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
  },
  countBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: 'rgba(147, 51, 234, 0.2)',
    borderWidth: 1,
    borderColor: 'rgba(147, 51, 234, 0.3)',
  },
  countText: {
    color: '#C084FC',
    fontSize: 12,
    fontWeight: '500',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#9CA3AF',
  },
  listContainer: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  favoriteItem: {
    flexDirection: 'row',
    backgroundColor: 'rgba(17, 24, 39, 0.5)',
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 16,
    padding: 12,
    overflow: 'hidden',
  },
  thumbnailContainer: {
    marginRight: 12,
  },
  thumbnail: {
    width: 80,
    height: 120,
    borderRadius: 8,
  },
  thumbnailOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  contentInfo: {
    flex: 1,
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    lineHeight: 20,
  },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: 'rgba(147, 51, 234, 0.2)',
    borderWidth: 1,
    borderColor: 'rgba(147, 51, 234, 0.3)',
    marginBottom: 8,
  },
  statusText: {
    color: '#C084FC',
    fontSize: 10,
    fontWeight: '500',
  },
  genre: {
    fontSize: 12,
    marginBottom: 2,
  },
  duration: {
    fontSize: 12,
    marginBottom: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rating: {
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 4,
  },
  removeButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  removeIcon: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  emptyIconContainer: {
    width: 192,
    height: 192,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    position: 'relative',
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 12,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 20,
  },
  exploreButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 16,
    backgroundColor: '#9333EA',
  },
  exploreButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default FavoritesScreen;

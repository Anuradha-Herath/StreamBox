import { useEffect, useState } from 'react';
import {
  Image,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { ArrowLeft, Calendar, Clock, Play, Plus, Share2, Star } from 'react-native-feather';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import LoadingSpinner from '../components/LoadingSpinner';
import { addFavorite, removeFavorite } from '../redux/favoritesSlice';
import { movieService } from '../services/api';
import { getTheme } from '../styles/theme';
import { POSTER_BASE_URL } from '../utils/constants';

const BACKDROP_BASE_URL = 'https://image.tmdb.org/t/p/w1280';

const MovieDetailsScreen = ({ route, navigation }) => {
  const { movie } = route.params;
  const dispatch = useDispatch();
  const { favorites } = useSelector(state => state.favorites);
  const isDarkMode = useSelector(state => state.theme.isDarkMode);
  const theme = getTheme(isDarkMode);
  const isFavorite = favorites.some(fav => fav.id === movie.id);
  const [fullMovie, setFullMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isInWatchlist, setIsInWatchlist] = useState(false);
  const [similarMovies, setSimilarMovies] = useState([]);

  useEffect(() => {
    fetchMovieDetails();
  }, [movie.id]);

  const fetchMovieDetails = async () => {
    try {
      setLoading(true);
      const [movieData, similarData] = await Promise.all([
        movieService.getMovieDetails(movie.id),
        movieService.getSimilarMovies(movie.id)
      ]);
      setFullMovie(movieData);
      setSimilarMovies(similarData.results || []);
    } catch (error) {
      console.error('Failed to fetch movie details:', error);
      // Fallback to basic movie data
      setFullMovie(movie);
      setSimilarMovies([]);
    } finally {
      setLoading(false);
    }
  };

  const handleFavoriteToggle = () => {
    if (isFavorite) {
      dispatch(removeFavorite(movie.id));
    } else {
      dispatch(addFavorite(movie));
    }
  };

  const handleWatchlistToggle = () => {
    setIsInWatchlist(!isInWatchlist);
  };

  const handlePlayNow = () => {
    // Placeholder for play functionality
    alert('Play functionality not implemented yet');
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Check out ${movie.title}! Rating: ${movie.vote_average}/10\n${movie.overview}`,
        title: movie.title,
      });
    } catch (error) {
      console.error('Share error:', error);
    }
  };

  if (loading) {
    return <LoadingSpinner isDarkMode={isDarkMode} message="Loading movie details..." />;
  }

  const displayMovie = fullMovie || movie;

  const formatDuration = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const getDirector = (credits) => {
    if (!credits || !credits.crew) return 'Unknown';
    const director = credits.crew.find(person => person.job === 'Director');
    return director ? director.name : 'Unknown';
  };

  const getYear = (releaseDate) => {
    return releaseDate ? new Date(releaseDate).getFullYear().toString() : 'Unknown';
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Hero Section with Backdrop */}
        <View style={styles.heroSection}>
          <Image
            source={{ uri: BACKDROP_BASE_URL + (displayMovie.backdrop_path || displayMovie.poster_path) }}
            style={styles.heroImage}
          />
          {/* Gradient Overlay */}
          <View style={styles.gradientOverlay} />
          {/* Header Controls */}
          <View style={styles.headerControls}>
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={styles.controlButton}
            >
              <ArrowLeft width={20} height={20} stroke="#FFF" />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleShare}
              style={styles.controlButton}
            >
              <Share2 width={20} height={20} stroke="#FFF" />
            </TouchableOpacity>
          </View>
          {/* Movie Info Overlay */}
          <View style={styles.movieInfoOverlay}>
            <View style={styles.genresContainer}>
              {displayMovie.genres && displayMovie.genres.slice(0, 3).map((genre, index) => (
                <View key={index} style={styles.genreTag}>
                  <Text style={styles.genreText}>{genre.name || genre}</Text>
                </View>
              ))}
            </View>
            <Text style={styles.title}>{displayMovie.title || 'Untitled'}</Text>
            <View style={styles.movieStats}>
              <View style={styles.statItem}>
                <Star width={16} height={16} stroke="#FFD700" fill="#FFD700" />
                <Text style={styles.statText}>{displayMovie.vote_average?.toFixed(1) || 'N/A'}</Text>
              </View>
              <View style={styles.statItem}>
                <Calendar width={16} height={16} stroke="#FFF" />
                <Text style={styles.statText}>{getYear(displayMovie.release_date)}</Text>
              </View>
              <View style={styles.statItem}>
                <Clock width={16} height={16} stroke="#FFF" />
                <Text style={styles.statText}>{displayMovie.runtime ? formatDuration(displayMovie.runtime) : 'N/A'}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={styles.playButton}
            onPress={handlePlayNow}
          >
            <Play width={20} height={20} stroke="#FFF" fill="#FFF" />
            <Text style={styles.playButtonText}>Play Now</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.watchlistButton, isInWatchlist && styles.watchlistButtonActive]}
            onPress={handleWatchlistToggle}
          >
            <Plus width={24} height={24} stroke={isInWatchlist ? theme.primary : '#9CA3AF'} />
          </TouchableOpacity>
        </View>

        {/* Content Sections */}
        <View style={styles.content}>
          {/* Synopsis */}
          {displayMovie.overview && (
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: theme.text }]}>Synopsis</Text>
              <Text style={[styles.synopsis, { color: theme.textSecondary }]}>{displayMovie.overview}</Text>
            </View>
          )}

          {/* Director */}
          <View style={styles.section}>
            <Text style={[styles.directorLabel, { color: theme.textSecondary }]}>Directed by</Text>
            <Text style={[styles.directorName, { color: theme.text }]}>{getDirector(displayMovie.credits)}</Text>
          </View>

          {/* Cast */}
          {displayMovie.credits && displayMovie.credits.cast && displayMovie.credits.cast.length > 0 && (
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: theme.text }]}>Cast</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.castScroll}>
                {displayMovie.credits.cast.slice(0, 10).map((actor, index) => (
                  <View key={index} style={styles.castItem}>
                    <Image
                      source={{ uri: POSTER_BASE_URL + actor.profile_path }}
                      style={styles.castImage}
                    />
                    <Text style={[styles.castName, { color: theme.text }]} numberOfLines={1}>
                      {actor.name}
                    </Text>
                    <Text style={[styles.castRole, { color: theme.textSecondary }]} numberOfLines={1}>
                      {actor.character}
                    </Text>
                  </View>
                ))}
              </ScrollView>
            </View>
          )}

          {/* More Like This */}
          {similarMovies.length > 0 && (
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: theme.text }]}>More Like This</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.similarScroll}>
                {similarMovies.slice(0, 10).map((similarMovie) => (
                  <TouchableOpacity
                    key={similarMovie.id}
                    style={styles.similarItem}
                    onPress={() => navigation.push('MovieDetails', { movie: similarMovie })}
                  >
                    <Image
                      source={{ uri: POSTER_BASE_URL + similarMovie.poster_path }}
                      style={styles.similarImage}
                    />
                    <Text style={[styles.similarTitle, { color: theme.text }]} numberOfLines={2}>
                      {similarMovie.title}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  heroSection: {
    height: 400,
    position: 'relative',
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  gradientOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(18, 18, 24, 0.6)',
  },
  headerControls: {
    position: 'absolute',
    top: 50,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    zIndex: 10,
  },
  controlButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    backdropFilter: 'blur(10px)',
  },
  movieInfoOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  genresContainer: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  genreTag: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: 'rgba(147, 51, 234, 0.2)',
    borderWidth: 1,
    borderColor: 'rgba(147, 51, 234, 0.3)',
    marginRight: 8,
  },
  genreText: {
    color: '#C084FC',
    fontSize: 12,
    fontWeight: '500',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFF',
    marginBottom: 10,
  },
  movieStats: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  statText: {
    color: '#D1D5DB',
    fontSize: 14,
    marginLeft: 4,
  },
  actionButtons: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 20,
    gap: 12,
  },
  playButton: {
    flex: 1,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#9333EA',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  playButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
  watchlistButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 1,
    borderColor: 'rgba(156, 163, 175, 1)',
    backgroundColor: 'rgba(55, 65, 81, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  watchlistButtonActive: {
    borderColor: 'rgba(147, 51, 234, 0.5)',
    backgroundColor: 'rgba(147, 51, 234, 0.2)',
  },
  content: {
    paddingHorizontal: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  synopsis: {
    fontSize: 14,
    lineHeight: 20,
  },
  directorLabel: {
    fontSize: 14,
    marginBottom: 4,
  },
  directorName: {
    fontSize: 16,
    fontWeight: '500',
  },
  castScroll: {
    marginHorizontal: -20,
    paddingHorizontal: 20,
  },
  castItem: {
    width: 80,
    marginRight: 16,
    alignItems: 'center',
  },
  castImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 8,
    backgroundColor: '#E5E7EB',
  },
  castName: {
    fontSize: 12,
    fontWeight: '500',
    textAlign: 'center',
  },
  castRole: {
    fontSize: 10,
    textAlign: 'center',
  },
  similarScroll: {
    marginHorizontal: -20,
    paddingHorizontal: 20,
  },
  similarItem: {
    width: 120,
    marginRight: 12,
    alignItems: 'center',
  },
  similarImage: {
    width: 120,
    height: 180,
    borderRadius: 8,
    marginBottom: 8,
    backgroundColor: '#E5E7EB',
  },
  similarTitle: {
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 16,
  },
});

export default MovieDetailsScreen;

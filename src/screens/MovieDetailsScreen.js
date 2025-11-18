import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Share,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { Heart, Share2, ArrowLeft } from 'react-native-feather';
import { addFavorite, removeFavorite } from '../redux/favoritesSlice';
import { getTheme } from '../styles/theme';
import Button from '../components/Button';

const MovieDetailsScreen = ({ route, navigation, isDarkMode }) => {
  const { movie } = route.params;
  const dispatch = useDispatch();
  const { favorites } = useSelector(state => state.favorites);
  const theme = getTheme(isDarkMode);
  const isFavorite = favorites.some(fav => fav.id === movie.id);

  const handleFavoriteToggle = () => {
    if (isFavorite) {
      dispatch(removeFavorite(movie.id));
    } else {
      dispatch(addFavorite(movie));
    }
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

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <ArrowLeft width={24} height={24} stroke={theme.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.text }]} numberOfLines={1}>
          Details
        </Text>
        <View style={styles.headerPlaceholder} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Image source={{ uri: movie.poster_path }} style={styles.poster} />

        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={[styles.iconButton, { backgroundColor: theme.primary }]}
            onPress={handleFavoriteToggle}
          >
            <Heart
              width={24}
              height={24}
              stroke="#FFF"
              fill={isFavorite ? '#FFF' : 'none'}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.iconButton, { backgroundColor: theme.secondary }]}
            onPress={handleShare}
          >
            <Share2 width={24} height={24} stroke="#FFF" />
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
          <Text style={[styles.title, { color: theme.text }]}>{movie.title}</Text>

          <View style={styles.ratingContainer}>
            <Text style={[styles.rating, { color: theme.accent }]}>
              ⭐ {movie.vote_average?.toFixed(1) || 'N/A'} / 10
            </Text>
            {movie.release_date && (
              <Text style={[styles.releaseDate, { color: theme.textSecondary }]}>
                📅 {movie.release_date}
              </Text>
            )}
          </View>

          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>Overview</Text>
            <Text style={[styles.overview, { color: theme.textSecondary }]}>
              {movie.overview}
            </Text>
          </View>

          {movie.genres && movie.genres.length > 0 && (
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: theme.text }]}>Genres</Text>
              <View style={styles.genresContainer}>
                {movie.genres.map((genre, index) => (
                  <View
                    key={index}
                    style={[
                      styles.genreTag,
                      { backgroundColor: theme.primary },
                    ]}
                  >
                    <Text style={styles.genreText}>{genre}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {movie.runtime && (
            <View style={styles.infoRow}>
              <Text style={[styles.infoLabel, { color: theme.textSecondary }]}>
                Runtime:
              </Text>
              <Text style={[styles.infoValue, { color: theme.text }]}>
                {movie.runtime} minutes
              </Text>
            </View>
          )}

          {movie.budget && (
            <View style={styles.infoRow}>
              <Text style={[styles.infoLabel, { color: theme.textSecondary }]}>
                Budget:
              </Text>
              <Text style={[styles.infoValue, { color: theme.text }]}>
                ${(movie.budget / 1000000).toFixed(1)}M
              </Text>
            </View>
          )}

          {movie.revenue && (
            <View style={styles.infoRow}>
              <Text style={[styles.infoLabel, { color: theme.textSecondary }]}>
                Revenue:
              </Text>
              <Text style={[styles.infoValue, { color: theme.text }]}>
                ${(movie.revenue / 1000000).toFixed(1)}M
              </Text>
            </View>
          )}

          {movie.cast && movie.cast.length > 0 && (
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: theme.text }]}>Cast</Text>
              {movie.cast.slice(0, 3).map((actor, index) => (
                <View key={index} style={styles.castMember}>
                  <Text style={[styles.castName, { color: theme.text }]}>
                    {actor.name}
                  </Text>
                  <Text style={[styles.castRole, { color: theme.textSecondary }]}>
                    as {actor.character}
                  </Text>
                </View>
              ))}
            </View>
          )}

          <Button
            isDarkMode={isDarkMode}
            title={isFavorite ? '❤️ Remove from Favorites' : '🤍 Add to Favorites'}
            onPress={handleFavoriteToggle}
            style={styles.favoriteButton}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    flex: 1,
    textAlign: 'center',
  },
  headerPlaceholder: {
    width: 40,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  poster: {
    width: '100%',
    height: 300,
    backgroundColor: '#e0e0e0',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: 16,
    marginTop: -30,
    marginBottom: 20,
    zIndex: 10,
  },
  iconButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3,
    elevation: 5,
  },
  content: {
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 12,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  rating: {
    fontSize: 16,
    fontWeight: '600',
    marginRight: 16,
  },
  releaseDate: {
    fontSize: 14,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  overview: {
    fontSize: 14,
    lineHeight: 20,
  },
  genresContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  genreTag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  genreText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '500',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    marginBottom: 8,
  },
  infoLabel: {
    fontSize: 14,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '500',
  },
  castMember: {
    marginBottom: 12,
  },
  castName: {
    fontSize: 14,
    fontWeight: '500',
  },
  castRole: {
    fontSize: 12,
  },
  favoriteButton: {
    marginVertical: 20,
  },
});

export default MovieDetailsScreen;

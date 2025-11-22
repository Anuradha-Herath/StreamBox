import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Heart } from 'react-native-feather';
import { getTheme } from '../styles/theme';
import { POSTER_BASE_URL } from '../utils/constants';

const MovieCard = React.memo(({ movie, isDarkMode, onPress, onFavoritePress, isFavorite }) => {
  const theme = getTheme(isDarkMode);

  return (
    <TouchableOpacity
      style={[styles.container, { backgroundColor: theme.surface }]}
      onPress={onPress}
      activeOpacity={0.9}
    >
      <Image
        source={{ uri: POSTER_BASE_URL + movie.poster_path }}
        style={styles.poster}
      />
      <View style={styles.content}>
        <Text style={[styles.title, { color: theme.text }]} numberOfLines={2}>
          {movie.title}
        </Text>
        <View style={styles.ratingContainer}>
          <Text style={[styles.rating, { color: theme.accent }]}>
            ⭐ {movie.vote_average?.toFixed(1) || 'N/A'}
          </Text>
        </View>
        <Text style={[styles.overview, { color: theme.textSecondary }]} numberOfLines={2}>
          {movie.overview}
        </Text>
        <TouchableOpacity
          style={styles.favoriteButton}
          onPress={onFavoritePress}
        >
          <Heart
            width={20}
            height={20}
            stroke={isFavorite ? theme.primary : theme.textSecondary}
            fill={isFavorite ? theme.primary : 'none'}
          />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
});

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 12,
    marginVertical: 8,
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  poster: {
    width: '100%',
    height: 200,
    backgroundColor: '#e0e0e0',
  },
  content: {
    padding: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  ratingContainer: {
    marginBottom: 8,
  },
  rating: {
    fontSize: 14,
    fontWeight: '500',
  },
  overview: {
    fontSize: 12,
    lineHeight: 16,
    marginBottom: 10,
  },
  favoriteButton: {
    padding: 8,
    alignSelf: 'flex-end',
  },
});

MovieCard.displayName = 'MovieCard';

export default MovieCard;

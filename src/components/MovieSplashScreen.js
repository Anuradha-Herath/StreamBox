import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { getTheme } from '../styles/theme';

const MovieSplashScreen = ({ isDarkMode }) => {
  const theme = getTheme(isDarkMode);
  const [dotIndex, setDotIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setDotIndex((prev) => (prev + 1) % 4);
    }, 500);
    return () => clearInterval(timer);
  }, []);

  const getDots = () => {
    return ['•', '•', '•'].map((dot, i) => (
      <Text key={i} style={[styles.loadingDot, { opacity: i <= dotIndex ? 1 : 0.3, color: theme.primary }]}>
        {dot}
      </Text>
    ));
  };

  return (
    <LinearGradient
      colors={[theme.background, isDarkMode ? '#0a0e27' : '#f5f7fa']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      <View style={styles.content}>
        {/* Film Reel Icon */}
        <View style={[styles.filmReel, { borderColor: theme.primary }]}>
          <View style={[styles.reelDot1, { backgroundColor: theme.primary }]} />
          <View style={[styles.reelDot2, { backgroundColor: theme.primary }]} />
          <View style={[styles.reelDot3, { backgroundColor: theme.primary }]} />
        </View>

        {/* App Name */}
        <Text style={[styles.appName, { color: theme.text }]}>StreamBox</Text>
        <Text style={[styles.tagline, { color: theme.secondary }]}>Your Movie Universe</Text>

        {/* Loading Indicator */}
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.primary} />
          <View style={styles.dotsContainer}>{getDots()}</View>
        </View>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
  },
  filmReel: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,
    position: 'relative',
  },
  reelDot1: {
    width: 12,
    height: 12,
    borderRadius: 6,
    position: 'absolute',
    top: 10,
    left: 44,
  },
  reelDot2: {
    width: 12,
    height: 12,
    borderRadius: 6,
    position: 'absolute',
    bottom: 10,
    right: 20,
  },
  reelDot3: {
    width: 12,
    height: 12,
    borderRadius: 6,
    position: 'absolute',
    bottom: 10,
    left: 20,
  },
  appName: {
    fontSize: 42,
    fontWeight: '800',
    marginBottom: 8,
    letterSpacing: 1,
  },
  tagline: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 60,
    opacity: 0.8,
  },
  loadingContainer: {
    alignItems: 'center',
  },
  dotsContainer: {
    flexDirection: 'row',
    marginTop: 16,
  },
  loadingDot: {
    fontSize: 24,
    fontWeight: 'bold',
    marginHorizontal: 4,
  },
});

export default MovieSplashScreen;
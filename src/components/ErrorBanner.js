import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { getTheme } from '../styles/theme';

const ErrorBanner = ({ isDarkMode, message, onRetry }) => {
  const theme = getTheme(isDarkMode);

  return (
    <View style={[styles.container, { backgroundColor: theme.error }]}>
      <View style={styles.content}>
        <Ionicons name="alert-circle-outline" size={20} color="#FFF" />
        <Text style={styles.message}>{message}</Text>
      </View>
      {onRetry && (
        <TouchableOpacity onPress={onRetry} style={styles.retryButton}>
          <Text style={styles.retryText}>Retry</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    marginHorizontal: 12,
    marginVertical: 8,
    borderRadius: 8,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  message: {
    color: '#FFF',
    fontSize: 14,
    marginLeft: 8,
    flex: 1,
  },
  retryButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 4,
  },
  retryText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '600',
  },
});

export default ErrorBanner;

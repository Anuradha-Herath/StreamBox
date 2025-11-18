import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { getTheme } from '../styles/theme';

const LoadingSpinner = ({ isDarkMode, message = 'Loading...' }) => {
  const theme = getTheme(isDarkMode);

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <ActivityIndicator size="large" color={theme.primary} />
      <Text style={[styles.message, { color: theme.text }]}>{message}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  message: {
    marginTop: 16,
    fontSize: 16,
    fontWeight: '500',
  },
});

export default LoadingSpinner;

import React, { useState, useEffect } from 'react';
import { Provider } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import store from './src/redux/store';
import RootNavigator from './src/navigation/RootNavigator';
import { STORAGE_KEYS } from './src/utils/constants';

export default function App() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [appReady, setAppReady] = useState(false);

  useEffect(() => {
    loadThemePreference();
  }, []);

  const loadThemePreference = async () => {
    try {
      const savedTheme = await AsyncStorage.getItem(STORAGE_KEYS.THEME_MODE);
      if (savedTheme) {
        setIsDarkMode(JSON.parse(savedTheme));
      }
    } catch (error) {
      console.error('Failed to load theme preference:', error);
    }
    setAppReady(true);
  };

  if (!appReady) {
    return null;
  }

  return (
    <Provider store={store}>
      <RootNavigator isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />
    </Provider>
  );
}

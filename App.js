import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider } from 'react-redux';
import RootNavigator from './src/navigation/RootNavigator';
import store from './src/redux/store';
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
      <SafeAreaProvider>
        <RootNavigator isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />
      </SafeAreaProvider>
    </Provider>
  );
}

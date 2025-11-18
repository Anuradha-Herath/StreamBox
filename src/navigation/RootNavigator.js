import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDispatch, useSelector } from 'react-redux';
import { setUser } from '../redux/authSlice';
import { setTheme } from '../redux/themeSlice';
import { setFavorites } from '../redux/favoritesSlice';
import { STORAGE_KEYS } from '../utils/constants';
import AuthNavigator from './AuthNavigator';
import AppNavigator from './AppNavigator';
import LoadingSpinner from '../components/LoadingSpinner';

const Stack = createStackNavigator();

const RootNavigator = ({ isDarkMode, setIsDarkMode }) => {
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector(state => state.auth);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    bootstrapAsync();
  }, []);

  const bootstrapAsync = async () => {
    try {
      // Check if user is logged in
      const token = await AsyncStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
      const userData = await AsyncStorage.getItem(STORAGE_KEYS.USER_DATA);
      const themeMode = await AsyncStorage.getItem(STORAGE_KEYS.THEME_MODE);

      if (token && userData) {
        dispatch(setUser(JSON.parse(userData)));
      }

      if (themeMode) {
        const isDark = JSON.parse(themeMode);
        dispatch(setTheme(isDark));
        setIsDarkMode(isDark);
      }

      // Load favorites
      const savedFavorites = await AsyncStorage.getItem(STORAGE_KEYS.FAVORITES);
      if (savedFavorites) {
        dispatch(setFavorites(JSON.parse(savedFavorites)));
      }
    } catch (e) {
      console.error('Failed to restore session:', e);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <LoadingSpinner isDarkMode={isDarkMode} message="Loading..." />;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {isAuthenticated ? (
          <Stack.Group screenOptions={{ animationEnabled: false }}>
            <Stack.Screen name="AppStack">
              {() => <AppNavigator isDarkMode={isDarkMode} />}
            </Stack.Screen>
          </Stack.Group>
        ) : (
          <Stack.Group
            screenOptions={{
              animationEnabled: false,
              animationTypeForReplace: !isLoading ? 'pop' : 'fade',
            }}
          >
            <Stack.Screen
              name="AuthStack"
              options={{ animationTypeForReplace: false }}
            >
              {() => <AuthNavigator isDarkMode={isDarkMode} />}
            </Stack.Screen>
          </Stack.Group>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default RootNavigator;

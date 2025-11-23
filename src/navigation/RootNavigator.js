import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import * as SplashScreen from 'expo-splash-screen';
import { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import MovieSplashScreen from '../components/MovieSplashScreen';
import { logout, setUser } from '../redux/authSlice';
import { setFavorites } from '../redux/favoritesSlice';
import { setTheme } from '../redux/themeSlice';
import { authService } from '../services/api';
import { STORAGE_KEYS } from '../utils/constants';
import AppNavigator from './AppNavigator';
import AuthNavigator from './AuthNavigator';

const Stack = createStackNavigator();

const RootNavigator = () => {
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector(state => state.auth);
  const isDarkMode = useSelector(state => state.theme.isDarkMode);
  const [isLoading, setIsLoading] = useState(true);
  const [sessionError, setSessionError] = useState(null);

  useEffect(() => {
    bootstrapAsync();
  }, []);

  useEffect(() => {
    if (!isLoading) {
      SplashScreen.hideAsync();
    }
  }, [isLoading]);

  const bootstrapAsync = async () => {
    try {
      // Check if user is logged in
      const token = await AsyncStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
      const userData = await AsyncStorage.getItem(STORAGE_KEYS.USER_DATA);
      const themeMode = await AsyncStorage.getItem(STORAGE_KEYS.THEME_MODE);

      if (token && userData) {
        try {
          // Validate token by fetching user profile
          // If token is expired, the API will attempt to refresh it
          const profile = await authService.getProfile();
          
          const parsedUserData = JSON.parse(userData);
          const updatedUserData = {
            ...parsedUserData,
            ...profile, // Merge with fresh profile data
          };

          dispatch(
            setUser({
              ...updatedUserData,
              isAuthenticated: true,
            })
          );

          // Update stored user data with fresh info
          await AsyncStorage.setItem(
            STORAGE_KEYS.USER_DATA,
            JSON.stringify(updatedUserData)
          );
        } catch (error) {
          // If profile fetch fails, check if it's a session error
          if (error.code === 'SESSION_EXPIRED') {
            // Clear tokens and logout
            await AsyncStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
            await AsyncStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
            await AsyncStorage.removeItem(STORAGE_KEYS.USER_DATA);
            dispatch(logout());
            setSessionError('Session expired. Please login again.');
          } else {
            // For other errors, try to restore session anyway
            const parsedUserData = JSON.parse(userData);
            dispatch(setUser(parsedUserData));
          }
        }
      }

      // Load theme preference
      if (themeMode) {
        const isDark = JSON.parse(themeMode);
        dispatch(setTheme(isDark));
      }

      // Load favorites
      const savedFavorites = await AsyncStorage.getItem(STORAGE_KEYS.FAVORITES);
      if (savedFavorites) {
        dispatch(setFavorites(JSON.parse(savedFavorites)));
      }
    } catch (e) {
      console.error('Failed to restore session:', e);
      setSessionError('Failed to load session. Please try again.');
    } finally {
      // Add a minimum delay to show the splash screen
      setTimeout(() => {
        setIsLoading(false);
      }, 2500); // 2.5 seconds to display splash
    }
  };

  const handleRetry = useCallback(() => {
    setSessionError(null);
    setIsLoading(true);
    bootstrapAsync();
  }, []);

  if (isLoading) {
    return <MovieSplashScreen isDarkMode={isDarkMode} />;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {isAuthenticated ? (
          <Stack.Group screenOptions={{ animationEnabled: false }}>
            <Stack.Screen name="AppStack">
              {() => <AppNavigator />}
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
              {() => <AuthNavigator />}
            </Stack.Screen>
          </Stack.Group>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default RootNavigator;

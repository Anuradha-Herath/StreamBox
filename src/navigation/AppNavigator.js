import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Home, Heart, User, Settings } from 'react-native-feather';
import HomeScreen from '../screens/HomeScreen';
import MovieDetailsScreen from '../screens/MovieDetailsScreen';
import FavoritesScreen from '../screens/FavoritesScreen';
import ProfileScreen from '../screens/ProfileScreen';
import SettingsScreen from '../screens/SettingsScreen';
import { getTheme } from '../styles/theme';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const HomeStackNavigator = ({ isDarkMode }) => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animationEnabled: true,
      }}
    >
      <Stack.Screen name="HomeStack">
        {(props) => <HomeScreen {...props} isDarkMode={isDarkMode} />}
      </Stack.Screen>
      <Stack.Screen
        name="MovieDetails"
        options={{
          animationTypeForReplace: false,
        }}
      >
        {(props) => <MovieDetailsScreen {...props} isDarkMode={isDarkMode} />}
      </Stack.Screen>
    </Stack.Navigator>
  );
};

const FavoritesStackNavigator = ({ isDarkMode }) => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="FavoritesStack">
        {(props) => <FavoritesScreen {...props} isDarkMode={isDarkMode} />}
      </Stack.Screen>
      <Stack.Screen
        name="MovieDetails"
        options={{
          animationTypeForReplace: false,
        }}
      >
        {(props) => <MovieDetailsScreen {...props} isDarkMode={isDarkMode} />}
      </Stack.Screen>
    </Stack.Navigator>
  );
};

const ProfileStackNavigator = ({ isDarkMode }) => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="ProfileStack">
        {(props) => <ProfileScreen {...props} isDarkMode={isDarkMode} />}
      </Stack.Screen>
    </Stack.Navigator>
  );
};

const SettingsStackNavigator = ({ isDarkMode }) => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="SettingsStack">
        {(props) => <SettingsScreen {...props} isDarkMode={isDarkMode} />}
      </Stack.Screen>
    </Stack.Navigator>
  );
};

const AppNavigator = ({ isDarkMode }) => {
  const theme = getTheme(isDarkMode);

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: theme.primary,
        tabBarInactiveTintColor: theme.textSecondary,
        tabBarStyle: {
          backgroundColor: theme.surface,
          borderTopColor: theme.border,
          borderTopWidth: 1,
          paddingBottom: 8,
          paddingTop: 8,
          height: 70,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          marginTop: 4,
          fontWeight: '600',
        },
      }}
      initialRouteName="HomeTab"
    >
      <Tab.Screen
        name="HomeTab"
        component={HomeStackNavigator}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ color, size }) => (
            <Home width={size} height={size} stroke={color} />
          ),
        }}
        initialParams={{ isDarkMode }}
      />

      <Tab.Screen
        name="FavoritesTab"
        component={FavoritesStackNavigator}
        options={{
          tabBarLabel: 'Favorites',
          tabBarIcon: ({ color, size }) => (
            <Heart width={size} height={size} stroke={color} />
          ),
        }}
        initialParams={{ isDarkMode }}
      />

      <Tab.Screen
        name="ProfileTab"
        component={ProfileStackNavigator}
        options={{
          tabBarLabel: 'Profile',
          tabBarIcon: ({ color, size }) => (
            <User width={size} height={size} stroke={color} />
          ),
        }}
        initialParams={{ isDarkMode }}
      />

      <Tab.Screen
        name="SettingsTab"
        component={SettingsStackNavigator}
        options={{
          tabBarLabel: 'Settings',
          tabBarIcon: ({ color, size }) => (
            <Settings width={size} height={size} stroke={color} />
          ),
        }}
        initialParams={{ isDarkMode }}
      />
    </Tab.Navigator>
  );
};

export const createRootNavigator = (isDarkMode) => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="App">
        {() => <AppNavigator isDarkMode={isDarkMode} />}
      </Stack.Screen>
    </Stack.Navigator>
  );
};

export default AppNavigator;

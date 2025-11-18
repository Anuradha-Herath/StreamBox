import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';

const Stack = createStackNavigator();

const AuthNavigator = ({ isDarkMode }) => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animationEnabled: true,
        gestureEnabled: true,
      }}
      initialRouteName="Login"
    >
      <Stack.Screen name="Login">
        {(props) => <LoginScreen {...props} isDarkMode={isDarkMode} />}
      </Stack.Screen>
      <Stack.Screen
        name="Register"
        options={{
          animationTypeForReplace: false,
        }}
      >
        {(props) => <RegisterScreen {...props} isDarkMode={isDarkMode} />}
      </Stack.Screen>
    </Stack.Navigator>
  );
};

export default AuthNavigator;

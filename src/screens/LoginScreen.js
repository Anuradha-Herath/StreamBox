import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useDispatch } from 'react-redux';
import { useFormik } from 'formik';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { loginSuccess, loginFailure } from '../redux/authSlice';
import { authService } from '../services/api';
import { loginValidationSchema } from '../utils/validation';
import { STORAGE_KEYS } from '../utils/constants';
import TextInputField from '../components/TextInputField';
import Button from '../components/Button';
import { getTheme } from '../styles/theme';

const LoginScreen = ({ navigation, isDarkMode }) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const theme = getTheme(isDarkMode);

  const formik = useFormik({
    initialValues: {
      email: 'user@example.com',
      password: 'password123',
    },
    validationSchema: loginValidationSchema,
    onSubmit: handleLogin,
  });

  async function handleLogin(values) {
    try {
      setLoading(true);
      
      // Simulate API call
      const response = await authService.login(values.email, values.password);
      
      // Create mock user object
      const userData = {
        id: response.id || 1,
        username: values.email.split('@')[0],
        email: values.email,
        firstName: response.firstName || 'User',
      };

      // Save to Redux
      dispatch(
        loginSuccess({
          user: userData,
          token: response.token || 'mock-jwt-token',
        })
      );

      // Save to AsyncStorage
      await AsyncStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, response.token || 'mock-jwt-token');
      await AsyncStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(userData));

      setLoading(false);
      Alert.alert('Success', `Welcome back, ${userData.firstName}!`);
    } catch (error) {
      setLoading(false);
      dispatch(loginFailure(error.message));
      Alert.alert('Login Failed', error.message || 'Please try again');
    }
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={[styles.container, { backgroundColor: theme.background }]}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.headerSection}>
          <View style={[styles.logoContainer, { backgroundColor: theme.primary }]}>
            <Text style={styles.logo}>🎬</Text>
          </View>
          <Text style={[styles.title, { color: theme.text }]}>StreamBox</Text>
          <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
            Discover trending movies
          </Text>
        </View>

        <View style={styles.formSection}>
          <TextInputField
            isDarkMode={isDarkMode}
            label="Email"
            placeholder="Enter your email"
            value={formik.values.email}
            onChangeText={formik.handleChange('email')}
            keyboardType="email-address"
            error={formik.touched.email ? formik.errors.email : ''}
          />

          <TextInputField
            isDarkMode={isDarkMode}
            label="Password"
            placeholder="Enter your password"
            value={formik.values.password}
            onChangeText={formik.handleChange('password')}
            secureTextEntry
            error={formik.touched.password ? formik.errors.password : ''}
          />

          <Button
            isDarkMode={isDarkMode}
            title={loading ? 'Logging in...' : 'Login'}
            onPress={formik.handleSubmit}
            disabled={loading}
            style={styles.button}
          />

          <View style={styles.footerSection}>
            <Text style={[styles.footerText, { color: theme.textSecondary }]}>
              Don't have an account?
            </Text>
            <Button
              isDarkMode={isDarkMode}
              title="Register"
              variant="outline"
              size="small"
              onPress={() => navigation.navigate('Register')}
            />
          </View>
        </View>

        <View style={styles.demoCreds}>
          <Text style={[styles.demoText, { color: theme.textSecondary }]}>
            Demo Credentials:
          </Text>
          <Text style={[styles.demoText, { color: theme.textSecondary }]}>
            Email: user@example.com
          </Text>
          <Text style={[styles.demoText, { color: theme.textSecondary }]}>
            Password: password123
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  headerSection: {
    alignItems: 'center',
    marginBottom: 40,
    marginTop: 20,
  },
  logoContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  logo: {
    fontSize: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
  },
  formSection: {
    marginBottom: 30,
  },
  button: {
    marginTop: 20,
  },
  footerSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    justifyContent: 'center',
  },
  footerText: {
    fontSize: 14,
  },
  demoCreds: {
    marginTop: 20,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  demoText: {
    fontSize: 12,
    marginVertical: 2,
  },
});

export default LoginScreen;

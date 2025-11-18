import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Text,
} from 'react-native';
import { useDispatch } from 'react-redux';
import { useFormik } from 'formik';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { loginSuccess } from '../redux/authSlice';
import { authService } from '../services/api';
import { registerValidationSchema } from '../utils/validation';
import { STORAGE_KEYS } from '../utils/constants';
import TextInputField from '../components/TextInputField';
import Button from '../components/Button';
import { getTheme } from '../styles/theme';

const RegisterScreen = ({ navigation, isDarkMode }) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const theme = getTheme(isDarkMode);

  const formik = useFormik({
    initialValues: {
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
    validationSchema: registerValidationSchema,
    onSubmit: handleRegister,
  });

  async function handleRegister(values) {
    try {
      setLoading(true);

      // Call registration API
      const response = await authService.register(
        values.username,
        values.email,
        values.password
      );

      // Create user object
      const userData = {
        id: response.id || Date.now(),
        username: values.username,
        email: values.email,
        firstName: values.username,
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
      Alert.alert('Success', `Welcome, ${values.username}!`);
    } catch (error) {
      setLoading(false);
      Alert.alert('Registration Failed', error.message || 'Please try again');
    }
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={[styles.container, { backgroundColor: theme.background }]}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.headerSection}>
          <Text style={[styles.title, { color: theme.text }]}>Create Account</Text>
          <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
            Join StreamBox today
          </Text>
        </View>

        <View style={styles.formSection}>
          <TextInputField
            isDarkMode={isDarkMode}
            label="Username"
            placeholder="Enter a username"
            value={formik.values.username}
            onChangeText={formik.handleChange('username')}
            error={formik.touched.username ? formik.errors.username : ''}
          />

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
            placeholder="Enter a password"
            value={formik.values.password}
            onChangeText={formik.handleChange('password')}
            secureTextEntry
            error={formik.touched.password ? formik.errors.password : ''}
          />

          <TextInputField
            isDarkMode={isDarkMode}
            label="Confirm Password"
            placeholder="Confirm your password"
            value={formik.values.confirmPassword}
            onChangeText={formik.handleChange('confirmPassword')}
            secureTextEntry
            error={formik.touched.confirmPassword ? formik.errors.confirmPassword : ''}
          />

          <Button
            isDarkMode={isDarkMode}
            title={loading ? 'Creating Account...' : 'Register'}
            onPress={formik.handleSubmit}
            disabled={loading}
            style={styles.button}
          />

          <View style={styles.footerSection}>
            <Text style={[styles.footerText, { color: theme.textSecondary }]}>
              Already have an account?{' '}
            </Text>
            <Button
              isDarkMode={isDarkMode}
              title="Login"
              variant="outline"
              size="small"
              onPress={() => navigation.goBack()}
            />
          </View>
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
    marginBottom: 30,
    marginTop: 20,
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
});

export default RegisterScreen;

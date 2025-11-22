import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFormik } from 'formik';
import { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useDispatch } from 'react-redux';
import Button from '../components/Button';
import ErrorBanner from '../components/ErrorBanner';
import LoadingSpinner from '../components/LoadingSpinner';
import TextInputField from '../components/TextInputField';
import { loginFailure, loginSuccess } from '../redux/authSlice';
import { authService } from '../services/api';
import { getTheme } from '../styles/theme';
import { STORAGE_KEYS } from '../utils/constants';
import { getErrorMessage, loginValidationSchema } from '../utils/validation';

const LoginScreen = ({ navigation, isDarkMode }) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const theme = getTheme(isDarkMode);

  const formik = useFormik({
    initialValues: {
      email: 'emilys', // DummyJSON test user
      password: 'emilyspass', // DummyJSON test password
    },
    validationSchema: loginValidationSchema,
    onSubmit: handleLogin,
    validateOnChange: true,
    validateOnBlur: true,
  });

  async function handleLogin(values) {
    try {
      setLoading(true);
      setError(null);

      // Call real backend API
      const response = await authService.login(values.email, values.password);

      const userData = {
        id: response.user?.id || Date.now(),
        username: response.user?.username || values.email.split('@')[0],
        email: response.user?.email || values.email,
        firstName: response.user?.firstName || response.user?.username || 'User',
        lastName: response.user?.lastName || '',
        avatar: response.user?.avatar || null,
      };

      // Save to Redux
      dispatch(
        loginSuccess({
          user: userData,
          token: response.token,
        })
      );

      // Save to AsyncStorage
      await AsyncStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, response.token);
      if (response.refreshToken) {
        await AsyncStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, response.refreshToken);
      }
      await AsyncStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(userData));

      setLoading(false);
      Alert.alert('Success', `Welcome back, ${userData.firstName}!`);
    } catch (error) {
      setLoading(false);
      const errorMessage = getErrorMessage(error);
      setError(errorMessage);
      dispatch(loginFailure(errorMessage));
      console.error('Login error:', error);
    }
  }

  if (loading) {
    return <LoadingSpinner isDarkMode={isDarkMode} message="Logging in..." />;
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={[styles.container, { backgroundColor: theme.background }]}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.headerSection}>
          <View style={[styles.logoContainer, { backgroundColor: theme.primary }]}>
            <Text style={styles.logo}>🎬</Text>
          </View>
          <Text style={[styles.title, { color: theme.text }]}>StreamBox</Text>
          <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
            Discover trending movies
          </Text>
        </View>

        {error && (
          <ErrorBanner
            isDarkMode={isDarkMode}
            message={error}
            onClose={() => setError(null)}
          />
        )}

        <View style={styles.formSection}>
          <TextInputField
            isDarkMode={isDarkMode}
            label="Username or Email"
            placeholder="Enter username (e.g., emilys)"
            value={formik.values.email}
            onChangeText={formik.handleChange('email')}
            onBlur={formik.handleBlur('email')}
            keyboardType="default"
            autoCapitalize="none"
            editable={!loading}
            error={formik.touched.email ? formik.errors.email : ''}
          />

          <TextInputField
            isDarkMode={isDarkMode}
            label="Password"
            placeholder="Enter your password"
            value={formik.values.password}
            onChangeText={formik.handleChange('password')}
            onBlur={formik.handleBlur('password')}
            secureTextEntry
            editable={!loading}
            error={formik.touched.password ? formik.errors.password : ''}
          />

          <Button
            isDarkMode={isDarkMode}
            title={loading ? 'Logging in...' : 'Login'}
            onPress={formik.handleSubmit}
            disabled={loading || !formik.isValid}
            style={styles.button}
          />

          <Button
            isDarkMode={isDarkMode}
            title="Forgot Password?"
            variant="text"
            onPress={() => {
              // TODO: Implement password reset flow
              Alert.alert('Coming Soon', 'Password reset feature coming soon');
            }}
            style={styles.forgotButton}
          />

          <View style={styles.divider} />

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

          <View style={[styles.demoCreds, { backgroundColor: theme.surface, borderColor: theme.border }]}>
            <Text style={[styles.demoTitle, { color: theme.text }]}>📝 Test Credentials (DummyJSON):</Text>
            <Text style={[styles.demoText, { color: theme.textSecondary }]}>Username: emilys</Text>
            <Text style={[styles.demoText, { color: theme.textSecondary }]}>Password: emilyspass</Text>
            <Text style={[styles.demoText, { color: theme.textSecondary, fontSize: 11, marginTop: 8 }]}>
              More users available at dummyjson.com/users
            </Text>
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
  forgotButton: {
    marginTop: 12,
    paddingVertical: 8,
  },
  divider: {
    height: 1,
    backgroundColor: '#E0E0E0',
    marginVertical: 20,
  },
  footerSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 0,
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
  },
  demoTitle: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 8,
  },
  demoText: {
    fontSize: 12,
    marginVertical: 2,
  },
});

export default LoginScreen;

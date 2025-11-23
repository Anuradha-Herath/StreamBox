import { Ionicons } from '@expo/vector-icons';
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
import { useDispatch, useSelector } from 'react-redux';
import Button from '../components/Button';
import ErrorBanner from '../components/ErrorBanner';
import LoadingSpinner from '../components/LoadingSpinner';
import TextInputField from '../components/TextInputField';
import { loginFailure, loginSuccess } from '../redux/authSlice';
import { authService } from '../services/api';
import { getTheme } from '../styles/theme';
import { STORAGE_KEYS } from '../utils/constants';
import { getErrorMessage, loginValidationSchema } from '../utils/validation';

const LoginScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const isDarkMode = useSelector(state => state.theme.isDarkMode);
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
      // Don't show alert, let the navigation happen automatically
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
          <Text style={[styles.signInTitle, { color: theme.text }]}>Sign In</Text>

          <View style={styles.inputContainer}>
            <Ionicons name="person-outline" size={20} color={theme.textSecondary} style={styles.inputIcon} />
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
          </View>

          <View style={styles.inputContainer}>
            <Ionicons name="lock-closed-outline" size={20} color={theme.textSecondary} style={styles.inputIcon} />
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
          </View>

          <Button
            isDarkMode={isDarkMode}
            title={loading ? 'Signing In...' : 'Sign In'}
            onPress={formik.handleSubmit}
            disabled={loading || !formik.isValid}
            style={styles.button}
          />

          <Text
            style={[styles.forgotPassword, { color: theme.primary }]}
            onPress={() => {
              // TODO: Implement password reset flow
              Alert.alert('Coming Soon', 'Password reset feature coming soon');
            }}
          >
            Forgot Password?
          </Text>

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
    paddingHorizontal: 24,
    paddingVertical: 40,
    justifyContent: 'center',
  },
  headerSection: {
    alignItems: 'center',
    marginBottom: 50,
  },
  logoContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  logo: {
    fontSize: 50,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    opacity: 0.8,
  },
  formSection: {
    marginBottom: 40,
  },
  signInTitle: {
    fontSize: 24,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 20,
  },
  inputContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  inputIcon: {
    position: 'absolute',
    left: 12,
    top: 40,
    zIndex: 1,
  },
  button: {
    marginTop: 20,
    borderRadius: 8,
    height: 48,
    paddingVertical: 0,
    paddingHorizontal: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  forgotPassword: {
    fontSize: 14,
    textAlign: 'center',
    marginTop: 16,
    textDecorationLine: 'underline',
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(0,0,0,0.1)',
    marginVertical: 30,
  },
  footerSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  footerText: {
    fontSize: 16,
    marginRight: 8,
  },
  demoCreds: {
    marginTop: 30,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    opacity: 0.9,
  },
  demoTitle: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 10,
  },
  demoText: {
    fontSize: 13,
    marginVertical: 3,
  },
});

export default LoginScreen;

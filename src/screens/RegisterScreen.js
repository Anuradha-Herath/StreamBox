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
import {
  getErrorMessage,
  registerValidationSchema,
  validatePasswordStrength,
} from '../utils/validation';

const RegisterScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const isDarkMode = useSelector(state => state.theme.isDarkMode);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [passwordStrength, setPasswordStrength] = useState(null);
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
    validateOnChange: true,
    validateOnBlur: true,
  });

  const handlePasswordChange = (password) => {
    formik.handleChange('password')(password);
    const strength = validatePasswordStrength(password);
    setPasswordStrength(strength);
  };

  async function handleRegister(values) {
    try {
      setLoading(true);
      setError(null);

      // Call registration API
      const response = await authService.register(
        values.username,
        values.email,
        values.password
      );

      const userData = {
        id: response.user?.id || Date.now(),
        username: response.user?.username || values.username,
        email: response.user?.email || values.email,
        firstName: response.user?.firstName || values.username,
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
      Alert.alert('Success', `Welcome, ${values.username}!`);
    } catch (error) {
      setLoading(false);
      const errorMessage = getErrorMessage(error);
      setError(errorMessage);
      dispatch(loginFailure(errorMessage));
      console.error('Registration error:', error);
    }
  }

  if (loading) {
    return <LoadingSpinner isDarkMode={isDarkMode} message="Creating account..." />;
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
            Join the movie community
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
          <Text style={[styles.signInTitle, { color: theme.text }]}>Create Account</Text>

          <View style={styles.inputContainer}>
            <Ionicons name="person-outline" size={20} color={theme.textSecondary} style={styles.inputIcon} />
            <TextInputField
              isDarkMode={isDarkMode}
              label="Username"
              placeholder="Choose a username"
              value={formik.values.username}
              onChangeText={formik.handleChange('username')}
              onBlur={formik.handleBlur('username')}
              autoCapitalize="none"
              editable={!loading}
              error={formik.touched.username ? formik.errors.username : ''}
              helperText="3-30 characters, letters, numbers, underscores, and hyphens only"
            />
          </View>

          <View style={styles.inputContainer}>
            <Ionicons name="mail-outline" size={20} color={theme.textSecondary} style={styles.inputIcon} />
            <TextInputField
              isDarkMode={isDarkMode}
              label="Email"
              placeholder="Enter your email"
              value={formik.values.email}
              onChangeText={formik.handleChange('email')}
              onBlur={formik.handleBlur('email')}
              keyboardType="email-address"
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
              placeholder="Create a strong password"
              value={formik.values.password}
              onChangeText={handlePasswordChange}
              onBlur={formik.handleBlur('password')}
              secureTextEntry
              editable={!loading}
              error={formik.touched.password ? formik.errors.password : ''}
            />

            {passwordStrength && formik.values.password && (
              <View style={styles.strengthContainer}>
                <View
                  style={[
                    styles.strengthBar,
                    {
                      width: `${(passwordStrength.score / 5) * 100}%`,
                      backgroundColor:
                        passwordStrength.score < 2
                          ? '#ff4444'
                          : passwordStrength.score < 4
                          ? '#ffaa00'
                          : '#00aa00',
                    },
                  ]}
                />
              </View>
            )}

            {passwordStrength && formik.values.password && (
              <View style={styles.feedbackContainer}>
                {passwordStrength.feedback.map((item, index) => (
                  <Text
                    key={index}
                    style={[
                      styles.feedbackText,
                      {
                        color:
                          passwordStrength.feedback.includes('Strong password')
                            ? '#00aa00'
                            : '#ffaa00',
                      },
                    ]}
                  >
                    {passwordStrength.feedback.includes('Strong password') ? '✓' : '○'} {item}
                  </Text>
                ))}
              </View>
            )}
          </View>

          <View style={styles.inputContainer}>
            <Ionicons name="lock-closed-outline" size={20} color={theme.textSecondary} style={styles.inputIcon} />
            <TextInputField
              isDarkMode={isDarkMode}
              label="Confirm Password"
              placeholder="Confirm your password"
              value={formik.values.confirmPassword}
              onChangeText={formik.handleChange('confirmPassword')}
              onBlur={formik.handleBlur('confirmPassword')}
              secureTextEntry
              editable={!loading}
              error={formik.touched.confirmPassword ? formik.errors.confirmPassword : ''}
            />
          </View>

          <Button
            isDarkMode={isDarkMode}
            title={loading ? 'Creating Account...' : 'Register'}
            onPress={formik.handleSubmit}
            disabled={loading || !formik.isValid}
            style={styles.button}
          />

          <View style={styles.divider} />

          <View style={styles.footerSection}>
            <Text style={[styles.footerText, { color: theme.textSecondary }]}>
              Already have an account?
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
  strengthContainer: {
    height: 6,
    borderRadius: 3,
    marginTop: 8,
    marginBottom: 8,
    backgroundColor: '#e0e0e0',
    overflow: 'hidden',
  },
  strengthBar: {
    height: '100%',
    borderRadius: 3,
  },
  feedbackContainer: {
    marginBottom: 16,
    paddingHorizontal: 4,
  },
  feedbackText: {
    fontSize: 12,
    marginVertical: 2,
  },
});

export default RegisterScreen;

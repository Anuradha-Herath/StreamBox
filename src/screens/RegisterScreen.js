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
          <Text style={[styles.title, { color: theme.text }]}>Create Account</Text>
          <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
            Join StreamBox today
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

          <View>
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
              <View style={[styles.strengthContainer, { borderColor: theme.border }]}>
                <View
                  style={[
                    styles.strengthBar,
                    {
                      width: `${(passwordStrength.score / 5) * 100}%`,
                      backgroundColor:
                        passwordStrength.score < 2
                          ? theme.error
                          : passwordStrength.score < 4
                          ? theme.warning
                          : theme.success,
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
                            ? theme.success
                            : theme.warning,
                      },
                    ]}
                  >
                    {passwordStrength.feedback.includes('Strong password') ? '✓' : '○'} {item}
                  </Text>
                ))}
              </View>
            )}
          </View>

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
  strengthContainer: {
    height: 4,
    borderRadius: 2,
    marginTop: 8,
    marginBottom: 8,
    borderWidth: 1,
    overflow: 'hidden',
  },
  strengthBar: {
    height: '100%',
    borderRadius: 2,
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

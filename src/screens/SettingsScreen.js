import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Alert,
  Switch,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LogOut } from 'react-native-feather';
import { logout } from '../redux/authSlice';
import { toggleTheme } from '../redux/themeSlice';
import { STORAGE_KEYS } from '../utils/constants';
import Button from '../components/Button';
import { getTheme } from '../styles/theme';

const SettingsScreen = ({ navigation, isDarkMode }) => {
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.auth);
  const theme = getTheme(isDarkMode);

  const handleLogout = async () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        onPress: async () => {
          try {
            await AsyncStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
            await AsyncStorage.removeItem(STORAGE_KEYS.USER_DATA);
            dispatch(logout());
          } catch (error) {
            Alert.alert('Error', 'Failed to logout');
          }
        },
        style: 'destructive',
      },
    ]);
  };

  const handleThemeToggle = async () => {
    dispatch(toggleTheme());
    await AsyncStorage.setItem(STORAGE_KEYS.THEME_MODE, JSON.stringify(!isDarkMode));
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <Text style={[styles.header, { color: theme.text }]}>Settings</Text>

      <ScrollView contentContainerStyle={styles.content}>
        {/* User Info Section */}
        <View style={[styles.section, { borderColor: theme.border }]}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Account</Text>
          <View
            style={[
              styles.settingItem,
              { backgroundColor: theme.surface, borderColor: theme.border },
            ]}
          >
            <Text style={[styles.settingLabel, { color: theme.text }]}>
              Username
            </Text>
            <Text style={[styles.settingValue, { color: theme.textSecondary }]}>
              {user?.username || user?.firstName || 'Not set'}
            </Text>
          </View>

          <View
            style={[
              styles.settingItem,
              { backgroundColor: theme.surface, borderColor: theme.border },
            ]}
          >
            <Text style={[styles.settingLabel, { color: theme.text }]}>Email</Text>
            <Text style={[styles.settingValue, { color: theme.textSecondary }]}>
              {user?.email || 'Not set'}
            </Text>
          </View>
        </View>

        {/* Display Section */}
        <View style={[styles.section, { borderColor: theme.border }]}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Display</Text>
          <View
            style={[
              styles.settingItem,
              { backgroundColor: theme.surface, borderColor: theme.border },
            ]}
          >
            <Text style={[styles.settingLabel, { color: theme.text }]}>
              Dark Mode
            </Text>
            <Switch
              value={isDarkMode}
              onValueChange={handleThemeToggle}
              trackColor={{ false: theme.border, true: theme.primary }}
              thumbColor={isDarkMode ? theme.secondary : theme.text}
            />
          </View>
        </View>

        {/* About Section */}
        <View style={[styles.section, { borderColor: theme.border }]}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>About</Text>
          <View
            style={[
              styles.settingItem,
              { backgroundColor: theme.surface, borderColor: theme.border },
            ]}
          >
            <Text style={[styles.settingLabel, { color: theme.text }]}>
              App Version
            </Text>
            <Text style={[styles.settingValue, { color: theme.textSecondary }]}>
              1.0.0
            </Text>
          </View>

          <View
            style={[
              styles.settingItem,
              { backgroundColor: theme.surface, borderColor: theme.border },
            ]}
          >
            <Text style={[styles.settingLabel, { color: theme.text }]}>
              Framework
            </Text>
            <Text style={[styles.settingValue, { color: theme.textSecondary }]}>
              React Native & Expo
            </Text>
          </View>
        </View>

        {/* Danger Zone */}
        <View style={[styles.section, { borderColor: theme.border, marginBottom: 40 }]}>
          <Text style={[styles.sectionTitle, { color: theme.error }]}>
            Danger Zone
          </Text>
          <Button
            isDarkMode={isDarkMode}
            title="Logout"
            variant="outline"
            onPress={handleLogout}
            style={{ borderColor: theme.error }}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    fontSize: 28,
    fontWeight: '700',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  content: {
    paddingHorizontal: 16,
    paddingBottom: 40,
  },
  section: {
    marginBottom: 24,
    borderBottomWidth: 1,
    paddingBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 12,
    marginBottom: 8,
    borderRadius: 8,
    borderWidth: 1,
  },
  settingLabel: {
    fontSize: 14,
    fontWeight: '500',
  },
  settingValue: {
    fontSize: 13,
  },
});

export default SettingsScreen;

import { Feather } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { useState } from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../redux/authSlice';
import { getTheme } from '../styles/theme';
import { STORAGE_KEYS } from '../utils/constants';

const SettingsScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const isDarkMode = useSelector(state => state.theme.isDarkMode);
  const theme = getTheme(isDarkMode);
  const primaryColor = theme.primary;
  const errorColor = theme.error;

  const ToggleSwitch = ({ enabled, onChange }) => {
    return (
      <TouchableOpacity
        onPress={() => onChange(!enabled)}
        style={styles.toggleContainer}
        activeOpacity={0.8}
      >
        {enabled ? (
          <LinearGradient
            colors={[theme.primary, theme.secondary]}
            style={styles.toggleGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <View
              style={[
                styles.toggleThumb,
                styles.toggleThumbEnabled,
              ]}
            />
          </LinearGradient>
        ) : (
          <View style={styles.toggleDisabled}>
            <View
              style={[
                styles.toggleThumb,
                styles.toggleThumbDisabled,
              ]}
            />
          </View>
        )}
      </TouchableOpacity>
    );
  };

  const SettingSection = ({ title, children }) => {
    return (
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>{title}</Text>
        <View style={[styles.sectionContainer, { backgroundColor: theme.surface, borderColor: theme.border }]}>
          {children}
        </View>
      </View>
    );
  };

  const SettingItem = ({
    icon,
    title,
    subtitle,
    onClick,
    toggle,
    toggleValue,
    onToggleChange,
    danger,
  }) => {
    const titleColor = danger ? theme.error : theme.text;

    return (
      <TouchableOpacity
        onPress={onClick}
        disabled={toggle}
        style={[
          styles.settingItem,
          danger ? styles.settingItemDanger : styles.settingItemNormal,
        ]}
        activeOpacity={toggle ? 1 : 0.7}
      >
        <View
          style={[
            styles.settingIcon,
            danger ? { backgroundColor: theme.error + '1A' } : { backgroundColor: theme.primary + '1A' },
          ]}
        >
          {icon}
        </View>
        <View style={styles.settingText}>
          <Text style={[styles.settingTitle, { color: titleColor }]}>
            {title}
          </Text>
          {subtitle && (
            <Text style={[styles.settingSubtitle, { color: theme.textSecondary }]}>{subtitle}</Text>
          )}
        </View>
        {toggle && onToggleChange ? (
          <ToggleSwitch enabled={toggleValue || false} onChange={onToggleChange} />
        ) : (
          <Feather name="chevron-right" size={20} color="#666" />
        )}
      </TouchableOpacity>
    );
  };

  // Settings State
  const [pushNotifications, setPushNotifications] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(false);
  const [autoplay, setAutoplay] = useState(true);
  const [hdQuality] = useState(true);
  const [autoDownload, setAutoDownload] = useState(false);
  const [wifiOnly, setWifiOnly] = useState(true);
  const [subtitles, setSubtitles] = useState(false);

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
          } catch (_error) {
            Alert.alert('Error', 'Failed to logout');
          }
        },
        style: 'destructive',
      },
    ]);
  };

  const handleClearCache = () => {
    Alert.alert('Clear Cache', 'Cache cleared successfully!');
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Header */}
      <View style={[styles.header, { borderBottomColor: theme.border }]}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={[styles.backButton, { backgroundColor: theme.surface }]}
          activeOpacity={0.7}
        >
          <Feather name="chevron-left" size={20} color={theme.textSecondary} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.text }]}>Settings</Text>
      </View>

      {/* Content */}
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Account Section */}
        <SettingSection title="ACCOUNT">
          <SettingItem
            icon={<Feather name="user" size={20} color={theme.primary} />}
            title="Edit Profile"
            subtitle="Name, email, profile picture"
            onClick={() => navigation.navigate('Profile')}
          />
          <View style={[styles.separator, { backgroundColor: theme.border }]} />
          <SettingItem
            icon={<Feather name="globe" size={20} color={theme.primary} />}
            title="Language"
            subtitle="English (US)"
            onClick={() => {}}
          />
          <View style={[styles.separator, { backgroundColor: theme.border }]} />
          <SettingItem
            icon={<Feather name="smartphone" size={20} color={theme.primary} />}
            title="Manage Devices"
            subtitle="3 devices connected"
            onClick={() => {}}
          />
        </SettingSection>

        {/* Appearance Section */}
        <SettingSection title="APPEARANCE">
          <SettingItem
            icon={<Feather name="settings" size={20} color={primaryColor} />}
            title="Theme"
            subtitle="Customize your app appearance"
            onClick={() => {}}
          />
          <View style={[styles.separator, { backgroundColor: theme.border }]} />
          <SettingItem
            icon={<Feather name="moon" size={20} color={primaryColor} />}
            title="Dark Mode"
            subtitle="Currently enabled"
            toggle
            toggleValue={isDarkMode}
            onToggleChange={(value) => dispatch({ type: 'theme/setTheme', payload: !isDarkMode })}
          />
        </SettingSection>

        {/* Notifications Section */}
        <SettingSection title="NOTIFICATIONS">
          <SettingItem
            icon={<Feather name="bell" size={20} color={primaryColor} />}
            title="Push Notifications"
            subtitle="Get notified about new content"
            toggle
            toggleValue={pushNotifications}
            onToggleChange={setPushNotifications}
          />
          <View style={[styles.separator, { backgroundColor: theme.border }]} />
          <SettingItem
            icon={<Feather name="bell" size={20} color={primaryColor} />}
            title="Email Notifications"
            subtitle="Receive updates via email"
            toggle
            toggleValue={emailNotifications}
            onToggleChange={setEmailNotifications}
          />
        </SettingSection>

        {/* Playback Section */}
        <SettingSection title="PLAYBACK">
          <SettingItem
            icon={<Feather name="play" size={20} color={primaryColor} />}
            title="Autoplay"
            subtitle="Play next episode automatically"
            toggle
            toggleValue={autoplay}
            onToggleChange={setAutoplay}
          />
          <View style={[styles.separator, { backgroundColor: theme.border }]} />
          <SettingItem
            icon={<Feather name="volume-2" size={20} color={primaryColor} />}
            title="Video Quality"
            subtitle={hdQuality ? "HD (1080p)" : "SD (480p)"}
            onClick={() => {}}
          />
          <View style={[styles.separator, { backgroundColor: theme.border }]} />
          <SettingItem
            icon={<Feather name="play" size={20} color={primaryColor} />}
            title="Subtitles"
            subtitle="Show subtitles by default"
            toggle
            toggleValue={subtitles}
            onToggleChange={setSubtitles}
          />
        </SettingSection>

        {/* Downloads Section */}
        <SettingSection title="DOWNLOADS">
          <SettingItem
            icon={<Feather name="download" size={20} color={primaryColor} />}
            title="Auto Download"
            subtitle="Download new episodes"
            toggle
            toggleValue={autoDownload}
            onToggleChange={setAutoDownload}
          />
          <View style={[styles.separator, { backgroundColor: theme.border }]} />
          <SettingItem
            icon={<Feather name="wifi" size={20} color={primaryColor} />}
            title="Wi-Fi Only"
            subtitle="Download only on Wi-Fi"
            toggle
            toggleValue={wifiOnly}
            onToggleChange={setWifiOnly}
          />
          <View style={[styles.separator, { backgroundColor: theme.border }]} />
          <SettingItem
            icon={<Feather name="download" size={20} color={primaryColor} />}
            title="Download Quality"
            subtitle="High"
            onClick={() => {}}
          />
        </SettingSection>

        {/* Privacy & Security Section */}
        <SettingSection title="PRIVACY & SECURITY">
          <SettingItem
            icon={<Feather name="shield" size={20} color={primaryColor} />}
            title="Privacy Settings"
            subtitle="Control your data"
            onClick={() => {}}
          />
          <View style={[styles.separator, { backgroundColor: theme.border }]} />
          <SettingItem
            icon={<Feather name="shield" size={20} color={primaryColor} />}
            title="Security"
            subtitle="Password and authentication"
            onClick={() => {}}
          />
          <View style={[styles.separator, { backgroundColor: theme.border }]} />
          <SettingItem
            icon={<Feather name="trash-2" size={20} color={primaryColor} />}
            title="Clear Cache"
            subtitle="Free up storage space"
            onClick={handleClearCache}
          />
        </SettingSection>

        {/* Help & Support Section */}
        <SettingSection title="HELP & SUPPORT">
          <SettingItem
            icon={<Feather name="help-circle" size={20} color={primaryColor} />}
            title="Help Center"
            subtitle="FAQs and support"
            onClick={() => {}}
          />
          <View style={[styles.separator, { backgroundColor: theme.border }]} />
          <SettingItem
            icon={<Feather name="info" size={20} color={primaryColor} />}
            title="About StreamBox"
            subtitle="Version 1.0.0"
            onClick={() => {}}
          />
        </SettingSection>

        {/* Logout Section */}
        <SettingSection title="ACCOUNT ACTIONS">
          <SettingItem
            icon={<Feather name="log-out" size={20} color={errorColor} />}
            title="Log Out"
            subtitle="Sign out of your account"
            onClick={handleLogout}
            danger
          />
        </SettingSection>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  content: {
    paddingHorizontal: 24,
    paddingBottom: 100,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  sectionContainer: {
    borderRadius: 24,
    borderWidth: 1,
    overflow: 'hidden',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  settingItemNormal: {
    // hover effect not applicable in RN
  },
  settingItemDanger: {
    // similar
  },
  settingIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  settingText: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
  },
  settingSubtitle: {
    fontSize: 14,
    marginTop: 2,
  },
  separator: {
    height: 1,
  },
  toggleContainer: {
    width: 48,
    height: 28,
    borderRadius: 14,
  },
  toggleGradient: {
    width: 48,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
  },
  toggleDisabled: {
    width: 48,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#374151',
    justifyContent: 'center',
  },
  toggleThumb: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 3,
  },
  toggleThumbEnabled: {
    transform: [{ translateX: 20 }],
  },
  toggleThumbDisabled: {
    transform: [{ translateX: 4 }],
  },
});

export default SettingsScreen;

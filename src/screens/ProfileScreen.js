import {
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  Bell,
  ChevronRight,
  Award as Crown,
  Download,
  Globe,
  HelpCircle,
  Lock,
  LogOut,
  Settings as SettingsIcon,
  Shield,
  Tv,
  User,
  Video,
} from 'react-native-feather';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import BottomNav from '../components/BottomNav';
import { logout } from '../redux/authSlice';
import { getTheme } from '../styles/theme';

import { useState } from 'react';

const ProfileScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.auth);
  const { favorites } = useSelector(state => state.favorites);
  const isDarkMode = useSelector(state => state.theme.isDarkMode);
  const theme = getTheme(isDarkMode);

  const [autoDownload, setAutoDownload] = useState(false);
  const [notifications, setNotifications] = useState(true);

  const stats = [
    {
      label: 'Watch Time',
      value: '124h',
      icon: Video,
      color: '#9333EA',
    },
    {
      label: 'Favorites',
      value: favorites.length.toString(),
      icon: Crown,
      color: '#3B82F6',
    },
    {
      label: 'Downloads',
      value: '12',
      icon: Download,
      color: '#EC4899',
    },
  ];

  const settingsSections = [
    {
      title: 'Account',
      items: [
        {
          icon: User,
          label: 'Edit Profile',
          description: 'Update your personal information',
          action: () => {},
        },
        {
          icon: Lock,
          label: 'Change Password',
          description: 'Update your password',
          action: () => {},
        },
        {
          icon: Shield,
          label: 'Privacy & Security',
          description: 'Manage your privacy settings',
          action: () => {},
        },
      ],
    },
    {
      title: 'Preferences',
      items: [
        {
          icon: Bell,
          label: 'Notifications',
          description: notifications ? 'Enabled' : 'Disabled',
          hasToggle: true,
          toggleValue: notifications,
          onToggle: () => setNotifications(!notifications),
        },
        {
          icon: Download,
          label: 'Auto Download',
          description: autoDownload ? 'On WiFi only' : 'Disabled',
          hasToggle: true,
          toggleValue: autoDownload,
          onToggle: () => setAutoDownload(!autoDownload),
        },
        {
          icon: Globe,
          label: 'Language',
          description: 'English',
          action: () => {},
        },
        {
          icon: Tv,
          label: 'Video Quality',
          description: 'Auto (saves data)',
          action: () => {},
        },
      ],
    },
    {
      title: 'More',
      items: [
        {
          icon: HelpCircle,
          label: 'Help & Support',
          description: 'Get help with the app',
          action: () => {},
        },
        {
          icon: SettingsIcon,
          label: 'App Settings',
          description: 'Manage app preferences',
          action: () => navigation.navigate('SettingsTab'),
        },
      ],
    },
  ];

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {/* Header Section */}
        <View style={styles.header}>
          <View style={styles.headerGradient}>
            <View style={styles.headerBlur} />
          </View>
          <View style={styles.headerContent}>
            <Text style={[styles.headerTitle, { color: theme.text }]}>Profile</Text>

            {/* User Info Card */}
            <View style={[styles.userCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
              <View style={styles.userInfo}>
                <View style={styles.avatarContainer}>
                  <View style={[styles.avatar, { backgroundColor: theme.primary }]}>
                    <Text style={styles.avatarText}>
                      {user?.username?.charAt(0)?.toUpperCase() || 'U'}
                    </Text>
                  </View>
                  {/* Premium Badge - assuming user has premium status */}
                  <View style={styles.premiumBadge}>
                    <Crown width={16} height={16} stroke="#1F2937" />
                  </View>
                </View>

                <View style={styles.userDetails}>
                  <Text style={[styles.userName, { color: theme.text }]}>
                    {user?.username || 'User'}
                  </Text>
                  <Text style={[styles.userEmail, { color: theme.textSecondary }]}>
                    {user?.email || 'Not set'}
                  </Text>
                  <View style={styles.premiumTag}>
                    <Text style={styles.premiumText}>Premium Member</Text>
                  </View>
                </View>
              </View>

              {/* Stats */}
              <View style={styles.statsGrid}>
                {stats.map((stat, index) => (
                  <View key={index} style={[styles.statCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
                    <View style={[styles.statIcon, { backgroundColor: stat.color }]}>
                      <stat.icon width={20} height={20} stroke="#FFF" />
                    </View>
                    <Text style={[styles.statValue, { color: theme.text }]}>{stat.value}</Text>
                    <Text style={[styles.statLabel, { color: theme.textSecondary }]}>{stat.label}</Text>
                  </View>
                ))}
              </View>
            </View>
          </View>
        </View>

        {/* Settings Sections */}
        {settingsSections.map((section, sectionIndex) => (
          <View key={sectionIndex} style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>{section.title}</Text>

            <View style={styles.sectionItems}>
              {section.items.map((item, itemIndex) => (
                <TouchableOpacity
                  key={itemIndex}
                  style={[styles.settingItem, { backgroundColor: theme.surface, borderColor: theme.border }]}
                  onPress={item.hasToggle ? item.onToggle : item.action}
                >
                  <View style={styles.settingLeft}>
                    <View style={[styles.settingIcon, { backgroundColor: theme.surface }]}>
                      <item.icon width={20} height={20} stroke={theme.textSecondary} />
                    </View>
                    <View style={styles.settingText}>
                      <Text style={[styles.settingLabel, { color: theme.text }]}>{item.label}</Text>
                      <Text style={[styles.settingDescription, { color: theme.textSecondary }]}>{item.description}</Text>
                    </View>
                  </View>

                  {item.hasToggle ? (
                    <Switch
                      value={item.toggleValue}
                      onValueChange={item.onToggle}
                      trackColor={{ false: theme.border, true: theme.primary }}
                      thumbColor="#FFF"
                    />
                  ) : (
                    <ChevronRight width={20} height={20} stroke={theme.textSecondary} />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ))}

        {/* Sign Out Button */}
        <TouchableOpacity style={styles.signOutButton} onPress={handleLogout}>
          <LogOut width={20} height={20} stroke="#EF4444" />
          <Text style={styles.signOutText}>Sign Out</Text>
        </TouchableOpacity>

        {/* App Version */}
        <View style={styles.footer}>
          <Text style={[styles.versionText, { color: theme.textSecondary }]}>
            StreamBox v1.0.0
          </Text>
          <Text style={[styles.memberText, { color: theme.textSecondary }]}>
            Member since January 2024
          </Text>
        </View>
      </ScrollView>

      <BottomNav navigation={navigation} currentRoute="ProfileTab" />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 120,
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 32,
    position: 'relative',
    overflow: 'hidden',
  },
  headerGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(147, 51, 234, 0.1)',
  },
  headerBlur: {
    position: 'absolute',
    top: -32,
    right: -32,
    width: 128,
    height: 128,
    borderRadius: 64,
    backgroundColor: 'rgba(147, 51, 234, 0.2)',
  },
  headerContent: {
    position: 'relative',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 24,
  },
  userCard: {
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
  },
  userInfo: {
    flexDirection: 'row',
    marginBottom: 24,
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: '#FFF',
    fontSize: 32,
    fontWeight: '700',
  },
  premiumBadge: {
    position: 'absolute',
    bottom: -4,
    right: -4,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F59E0B',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#111827',
  },
  userDetails: {
    flex: 1,
    justifyContent: 'center',
  },
  userName: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    marginBottom: 8,
  },
  premiumTag: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 16,
    backgroundColor: 'rgba(245, 158, 11, 0.2)',
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.3)',
  },
  premiumText: {
    color: '#F59E0B',
    fontSize: 12,
    fontWeight: '500',
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    padding: 16,
    marginHorizontal: 4,
    borderRadius: 16,
    borderWidth: 1,
  },
  statIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  statValue: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
  },
  section: {
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 16,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  sectionItems: {
    gap: 8,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  settingText: {
    flex: 1,
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 2,
  },
  settingDescription: {
    fontSize: 14,
  },
  signOutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 16,
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.3)',
    marginBottom: 24,
  },
  signOutText: {
    color: '#EF4444',
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 8,
  },
  footer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  versionText: {
    fontSize: 14,
    marginBottom: 4,
  },
  memberText: {
    fontSize: 12,
  },
});

export default ProfileScreen;

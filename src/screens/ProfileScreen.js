import {
  ScrollView,
  StyleSheet,
  Text,
  View
} from 'react-native';
import { Mail, User } from 'react-native-feather';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';
import Button from '../components/Button';
import { getTheme } from '../styles/theme';

const ProfileScreen = ({ navigation, isDarkMode }) => {
  const { user } = useSelector(state => state.auth);
  const { favorites } = useSelector(state => state.favorites);
  const theme = getTheme(isDarkMode);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <ScrollView contentContainerStyle={styles.content}>
        {/* Header */}
        <Text style={[styles.header, { color: theme.text }]}>Profile</Text>

        {/* Avatar */}
        <View style={styles.avatarContainer}>
          <View
            style={[
              styles.avatar,
              { backgroundColor: theme.primary },
            ]}
          >
            <Text style={styles.avatarText}>
              {user?.username?.charAt(0)?.toUpperCase() || 'U'}
            </Text>
          </View>
        </View>

        {/* User Info */}
        <View style={styles.infoSection}>
          <View
            style={[
              styles.infoCard,
              { backgroundColor: theme.surface, borderColor: theme.border },
            ]}
          >
            <User width={20} height={20} stroke={theme.primary} />
            <View style={styles.infoContent}>
              <Text style={[styles.infoLabel, { color: theme.textSecondary }]}>
                Username
              </Text>
              <Text style={[styles.infoValue, { color: theme.text }]}>
                {user?.username || 'Not set'}
              </Text>
            </View>
          </View>

          <View
            style={[
              styles.infoCard,
              { backgroundColor: theme.surface, borderColor: theme.border },
            ]}
          >
            <Mail width={20} height={20} stroke={theme.primary} />
            <View style={styles.infoContent}>
              <Text style={[styles.infoLabel, { color: theme.textSecondary }]}>
                Email
              </Text>
              <Text style={[styles.infoValue, { color: theme.text }]}>
                {user?.email || 'Not set'}
              </Text>
            </View>
          </View>
        </View>

        {/* Stats */}
        <View style={styles.statsSection}>
          <Text style={[styles.statsTitle, { color: theme.text }]}>
            Your Activity
          </Text>
          <View style={styles.statsGrid}>
            <View
              style={[
                styles.statCard,
                { backgroundColor: theme.surface, borderColor: theme.border },
              ]}
            >
              <Text style={[styles.statNumber, { color: theme.primary }]}>
                {favorites.length}
              </Text>
              <Text style={[styles.statLabel, { color: theme.textSecondary }]}>
                Favorites
              </Text>
            </View>
            <View
              style={[
                styles.statCard,
                { backgroundColor: theme.surface, borderColor: theme.border },
              ]}
            >
              <Text style={[styles.statNumber, { color: theme.secondary }]}>
                {user ? '✓' : '✗'}
              </Text>
              <Text style={[styles.statLabel, { color: theme.textSecondary }]}>
                Member
              </Text>
            </View>
          </View>
        </View>

        {/* Actions */}
        <View style={styles.actionSection}>
          <Button
            isDarkMode={isDarkMode}
            title="View Favorites"
            onPress={() => navigation.navigate('FavoritesTab')}
            style={styles.button}
          />
          <Button
            isDarkMode={isDarkMode}
            title="Go to Settings"
            variant="secondary"
            onPress={() => navigation.navigate('SettingsTab')}
            style={styles.button}
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
  content: {
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  header: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 24,
  },
  avatarContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: '#FFF',
    fontSize: 40,
    fontWeight: '700',
  },
  infoSection: {
    marginBottom: 24,
  },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 12,
    marginBottom: 12,
    borderRadius: 8,
    borderWidth: 1,
  },
  infoContent: {
    marginLeft: 12,
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '500',
  },
  statsSection: {
    marginBottom: 24,
  },
  statsTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statCard: {
    flex: 0.48,
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
  },
  actionSection: {
    marginBottom: 20,
  },
  button: {
    marginBottom: 12,
  },
});

export default ProfileScreen;

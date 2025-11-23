import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../redux/authSlice';
import { commonStyles, getTheme } from '../styles/theme';

const Header = ({ isDarkMode, onMenuPress, onThemeToggle, title, navigation }) => {
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.auth);
  const theme = getTheme(isDarkMode);

  const handleLogout = () => {
    dispatch(logout());
  };

  const displayName = user?.firstName || user?.username || 'User';
  const initials = displayName
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <LinearGradient
      colors={['#9333EA', '#7C3AED']}
      style={[styles.container, commonStyles.shadow]}
    >
      <View style={styles.leftSection}>
        <TouchableOpacity
          onPress={onMenuPress}
          style={styles.iconButton}
          accessibilityLabel="Open menu"
          accessibilityRole="button"
        >
          <Ionicons name="menu" size={24} color="#FFF" />
        </TouchableOpacity>
      </View>

      <View style={styles.centerSection}>
        <Text style={styles.title}>{title || 'StreamBox'}</Text>
      </View>

      <View style={styles.rightSection}>
        <TouchableOpacity
          onPress={onThemeToggle}
          style={styles.iconButton}
          accessibilityLabel="Toggle theme"
          accessibilityRole="button"
        >
          {isDarkMode ? (
            <Ionicons name="moon" size={22} color="#FFF" />
          ) : (
            <Ionicons name="sunny" size={22} color="#FFF" />
          )}
        </TouchableOpacity>

        {user && (
          <TouchableOpacity
            style={[styles.userAvatar, { backgroundColor: theme.secondary }]}
            onPress={() => navigation.navigate('ProfileTab')}
            accessibilityLabel="Go to profile"
            accessibilityRole="button"
          >
            <Text style={styles.avatarText}>{initials}</Text>
            <Ionicons name="chevron-forward" size={12} color="#FFF" style={styles.chevron} />
          </TouchableOpacity>
        )}
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,  // Increased for better spacing
    paddingVertical: 14,
    paddingTop: 18,
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  centerSection: {
    flex: 1,
    alignItems: 'center',
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontSize: 20,  // Larger for prominence
    fontWeight: '800',  // Bolder
    color: '#FFF',
  },
  username: {
    color: '#FFF',
    fontSize: 14,  // Slightly larger
    marginHorizontal: 12,  // More padding
    maxWidth: 120,  // Allow more space
    fontWeight: '600',
  },
  userAvatar: {
    width: 36,  // Slightly larger
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',  // For chevron positioning
  },
  avatarText: {
    color: '#FFF',
    fontSize: 14,  // Larger
    fontWeight: '700',
  },
  chevron: {
    position: 'absolute',
    right: -10,  // Position outside the circle
    top: '50%',
    transform: [{ translateY: -6 }],
  },
  iconButton: {
    padding: 10,  // Slightly more padding
    borderRadius: 20,
  },
});

export default Header;

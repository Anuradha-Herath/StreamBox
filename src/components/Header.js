import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { LogOut, Menu, Moon, Sun } from 'react-native-feather';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../redux/authSlice';
import { getTheme } from '../styles/theme';

const Header = ({ isDarkMode, onMenuPress, onThemeToggle, title }) => {
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
    <View style={[styles.container, { backgroundColor: theme.primary }]}>
      <View style={styles.leftSection}>
        <TouchableOpacity onPress={onMenuPress} style={styles.iconButton}>
          <Menu width={24} height={24} stroke="#FFF" />
        </TouchableOpacity>
        <Text style={styles.title}>{title || 'StreamBox'}</Text>
      </View>

      <View style={styles.rightSection}>
        {user && (
          <TouchableOpacity
            style={[styles.userAvatar, { backgroundColor: theme.secondary }]}
            onPress={() => {
              // TODO: Navigate to profile screen
            }}
          >
            <Text style={styles.avatarText}>{initials}</Text>
          </TouchableOpacity>
        )}

        {user && (
          <Text style={styles.username} numberOfLines={1}>
            {displayName}
          </Text>
        )}

        <TouchableOpacity onPress={onThemeToggle} style={styles.iconButton}>
          {isDarkMode ? (
            <Sun width={22} height={22} stroke="#FFF" />
          ) : (
            <Moon width={22} height={22} stroke="#FFF" />
          )}
        </TouchableOpacity>

        {user && (
          <TouchableOpacity onPress={handleLogout} style={styles.iconButton}>
            <LogOut width={22} height={22} stroke="#FFF" />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingTop: 16,
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFF',
    marginLeft: 12,
  },
  username: {
    color: '#FFF',
    fontSize: 13,
    marginHorizontal: 8,
    maxWidth: 100,
    fontWeight: '500',
  },
  userAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: '#FFF',
    fontSize: 13,
    fontWeight: '700',
  },
  iconButton: {
    padding: 8,
    borderRadius: 20,
  },
});

export default Header;

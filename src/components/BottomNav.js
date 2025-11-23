import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSelector } from 'react-redux';
import { getTheme } from '../styles/theme';

const BottomNav = ({ navigation, currentRoute }) => {
  const isDarkMode = useSelector(state => state.theme.isDarkMode);
  const theme = getTheme(isDarkMode);

  const isActive = (routeName) => {
    return currentRoute === routeName;
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.surface, borderTopColor: theme.border }]}>
      <View style={styles.navContainer}>
        <TouchableOpacity
          style={styles.navButton}
          onPress={() => navigation.navigate('HomeTab')}
        >
          <View
            style={[
              styles.iconContainer,
              isActive('HomeTab') && styles.iconContainerActive,
            ]}
          >
            <Ionicons
              name="home-outline"
              size={24}
              color={isActive('HomeTab') ? theme.primary : theme.textSecondary}
            />
          </View>
          <Text
            style={[
              styles.label,
              { color: isActive('HomeTab') ? theme.primary : theme.textSecondary },
            ]}
          >
            Home
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navButton}
          onPress={() => navigation.navigate('FavoritesTab')}
        >
          <View
            style={[
              styles.iconContainer,
              isActive('FavoritesTab') && styles.iconContainerActive,
            ]}
          >
            <Ionicons
              name="heart-outline"
              size={24}
              color={isActive('FavoritesTab') ? theme.primary : theme.textSecondary}
            />
          </View>
          <Text
            style={[
              styles.label,
              { color: isActive('FavoritesTab') ? theme.primary : theme.textSecondary },
            ]}
          >
            Favorites
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navButton}
          onPress={() => navigation.navigate('ProfileTab')}
        >
          <View
            style={[
              styles.iconContainer,
              isActive('ProfileTab') && styles.iconContainerActive,
            ]}
          >
            <Ionicons
              name="person-outline"
              size={24}
              color={isActive('ProfileTab') ? theme.primary : theme.textSecondary}
            />
          </View>
          <Text
            style={[
              styles.label,
              { color: isActive('ProfileTab') ? theme.primary : theme.textSecondary },
            ]}
          >
            Profile
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    borderTopWidth: 1,
    zIndex: 50,
  },
  navContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  navButton: {
    alignItems: 'center',
    gap: 4,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconContainerActive: {
    backgroundColor: 'rgba(147, 51, 234, 0.2)',
  },
  label: {
    fontSize: 12,
    fontWeight: '500',
    marginTop: 4,
  },
});

export default BottomNav;
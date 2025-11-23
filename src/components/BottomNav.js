import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Heart, Home, User } from 'react-native-feather';

const BottomNav = ({ navigation, currentRoute }) => {

  const isActive = (routeName) => {
    return currentRoute === routeName;
  };

  return (
    <View style={[styles.container, { backgroundColor: '#1e1e1e', borderTopColor: '#374151' }]}>
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
            <Home
              width={24}
              height={24}
              stroke={isActive('HomeTab') ? '#FFF' : '#9CA3AF'}
            />
          </View>
          <Text
            style={[
              styles.label,
              { color: isActive('HomeTab') ? '#C084FC' : '#9CA3AF' },
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
            <Heart
              width={24}
              height={24}
              stroke={isActive('FavoritesTab') ? '#FFF' : '#9CA3AF'}
            />
          </View>
          <Text
            style={[
              styles.label,
              { color: isActive('FavoritesTab') ? '#C084FC' : '#9CA3AF' },
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
            <User
              width={24}
              height={24}
              stroke={isActive('ProfileTab') ? '#FFF' : '#9CA3AF'}
            />
          </View>
          <Text
            style={[
              styles.label,
              { color: isActive('ProfileTab') ? '#C084FC' : '#9CA3AF' },
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
    backgroundColor: '#9333EA', // Purple gradient approximation
  },
  label: {
    fontSize: 12,
    fontWeight: '500',
    marginTop: 4,
  },
});

export default BottomNav;
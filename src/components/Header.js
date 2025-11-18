import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Menu, Moon, Sun } from 'react-native-feather';
import { getTheme } from '../styles/theme';

const Header = ({ isDarkMode, onMenuPress, onThemeToggle, title, username }) => {
  const theme = getTheme(isDarkMode);

  return (
    <View style={[styles.container, { backgroundColor: theme.primary }]}>
      <View style={styles.leftSection}>
        <TouchableOpacity onPress={onMenuPress} style={styles.iconButton}>
          <Menu width={24} height={24} stroke="#FFF" />
        </TouchableOpacity>
        <Text style={styles.title}>{title || 'StreamBox'}</Text>
      </View>
      <View style={styles.rightSection}>
        {username && (
          <Text style={styles.username} numberOfLines={1}>
            {username}
          </Text>
        )}
        <TouchableOpacity onPress={onThemeToggle} style={styles.iconButton}>
          {isDarkMode ? (
            <Sun width={22} height={22} stroke="#FFF" />
          ) : (
            <Moon width={22} height={22} stroke="#FFF" />
          )}
        </TouchableOpacity>
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
    paddingTop: 12,
    paddingBottom: 12,
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
    fontSize: 12,
    marginRight: 12,
    maxWidth: 100,
  },
  iconButton: {
    padding: 8,
    borderRadius: 20,
  },
});

export default Header;

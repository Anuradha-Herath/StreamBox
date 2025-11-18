import React from 'react';
import { TextInput, StyleSheet, View } from 'react-native';
import { Search } from 'react-native-feather';
import { getTheme } from '../styles/theme';

const SearchBar = ({ isDarkMode, onSearch, placeholder = 'Search movies...' }) => {
  const theme = getTheme(isDarkMode);

  return (
    <View style={[styles.container, { backgroundColor: theme.surface }]}>
      <Search width={18} height={18} stroke={theme.textSecondary} />
      <TextInput
        style={[styles.input, { color: theme.text }]}
        placeholder={placeholder}
        placeholderTextColor={theme.textSecondary}
        onChangeText={onSearch}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 8,
    marginHorizontal: 12,
    marginVertical: 8,
  },
  input: {
    flex: 1,
    marginLeft: 8,
    fontSize: 14,
  },
});

export default SearchBar;

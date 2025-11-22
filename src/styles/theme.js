export const themes = {
  light: {
    primary: '#FF6B6B',
    secondary: '#4ECDC4',
    accent: '#FFE66D',
    background: '#FFFFFF',
    surface: '#F7F7F7',
    text: '#2D3436',
    textSecondary: '#636E72',
    border: '#E8E8E8',
    error: '#D63031',
    success: '#00B894',
    warning: '#FDCB6E',
    disabled: '#DFE6E9',
  },
  dark: {
    primary: '#FF6B6B',
    secondary: '#4ECDC4',
    accent: '#FFE66D',
    background: '#1E1E1E',
    surface: '#2D2D2D',
    text: '#FFFFFF',
    textSecondary: '#B0B0B0',
    border: '#404040',
    error: '#FF7675',
    success: '#55EFC4',
    warning: '#FDCB6E',
    disabled: '#636E72',
  },
};

export const getTheme = (isDark) => (isDark ? themes.dark : themes.light);

export const commonStyles = {
  shadow: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
};

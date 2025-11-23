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
    primary: '#8B5CF6',
    secondary: '#A78BFA',
    accent: '#C4B5FD',
    background: '#0F0F23',
    surface: '#1A1A2E',
    text: '#FFFFFF',
    textSecondary: '#CBD5E1',
    border: '#334155',
    error: '#EF4444',
    success: '#10B981',
    warning: '#F59E0B',
    disabled: '#64748B',
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

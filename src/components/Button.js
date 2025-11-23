import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import { getTheme } from '../styles/theme';

const Button = ({
  isDarkMode,
  onPress,
  title,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  style,
  textStyle,
}) => {
  const theme = getTheme(isDarkMode);

  const getBackgroundColor = () => {
    if (disabled) return theme.disabled;
    switch (variant) {
      case 'primary':
        return theme.primary;
      case 'secondary':
        return theme.secondary;
      case 'outline':
        return 'transparent';
      default:
        return theme.primary;
    }
  };

  const getTextColor = () => {
    if (variant === 'outline') return theme.primary;
    return '#FFF';
  };

  const getSize = () => {
    switch (size) {
      case 'small':
        return { paddingVertical: 8, paddingHorizontal: 12, fontSize: 12 };
      case 'large':
        return { paddingVertical: 14, paddingHorizontal: 20, fontSize: 16 };
      default:
        return { paddingVertical: 12, paddingHorizontal: 16, fontSize: 14 };
    }
  };

  return (
    <TouchableOpacity
      style={[
        styles.container,
        {
          backgroundColor: getBackgroundColor(),
          borderColor: theme.primary,
          borderWidth: variant === 'outline' ? 2 : 0,
          ...getSize(),
        },
        style,
      ]}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.8}
    >
      <Text
        style={[
          styles.text,
          { color: getTextColor() },
          textStyle,
        ]}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontWeight: '600',
  },
});

export default Button;

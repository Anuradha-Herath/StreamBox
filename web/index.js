// Web-specific polyfills and fixes
import { Text as RNText } from 'react-native';

// Fix for React Native Web Text constructor issue
if (typeof window !== 'undefined') {
  const OriginalText = RNText;
  
  // Override Text if it has issues with constructor
  if (RNText && typeof RNText !== 'function') {
    global.Text = function Text() {
      return OriginalText.apply(this, arguments);
    };
  }
}

export default {};

# StreamBox - Development Guide

## Getting Started

### 1. First Time Setup
```bash
npm install
npm start
```

### 2. Development Workflow

#### Adding a New Screen
1. Create component in `src/screens/NewScreen.js`
2. Add to appropriate navigator in `src/navigation/`
3. Connect to Redux if needed
4. Add navigation parameter in route

#### Adding a New Feature
1. Create Redux slice in `src/redux/newFeatureSlice.js`
2. Add slice to store in `src/redux/store.js`
3. Create service in `src/services/` if API call needed
4. Use in components via `useSelector` and `useDispatch`

#### Adding a New Component
1. Create reusable component in `src/components/`
2. Define clear props interface
3. Support dark mode with theme
4. Export from component directory

### 3. Commit Convention

Follow feature-based commits:
```bash
git commit -m "feat: add movie search functionality"
git commit -m "fix: correct favorites persistence"
git commit -m "style: update button styling"
git commit -m "refactor: extract header component"
```

## Architecture Decisions

### Why Redux Toolkit?
- Simplified Redux setup
- Built-in immer for immutable updates
- Thunk middleware for async actions
- Great DevTools support

### Why React Navigation?
- Native feel on both iOS and Android
- Flexible navigation structures
- Good community support
- Excellent documentation

### Why Yup?
- Declarative validation schema
- Integrates well with forms
- Clear error messages
- Extensible validators

## Performance Tips

1. **Use selectors for Redux:**
```javascript
const movies = useSelector(state => state.movies.movies);
```

2. **Memoize components:**
```javascript
const MovieCard = React.memo(({ movie, onPress }) => {
  // component
});
```

3. **Lazy load images:**
```javascript
<Image source={{ uri: imageUrl }} />
```

4. **Avoid inline objects in styles:**
```javascript
// Bad
<View style={{ backgroundColor: 'red' }} />
// Good
const styles = StyleSheet.create({ container: { backgroundColor: 'red' } })
```

## Testing

### Components
Test with:
- User interactions (press, scroll)
- Redux state changes
- Theme switching
- Error states

### Services
Mock API responses for testing:
```javascript
jest.mock('../services/api', () => ({
  movieService: {
    getTrendingMovies: jest.fn()
  }
}));
```

## Troubleshooting

### Common Issues

1. **Blank screen after login**
   - Check Redux store initialization
   - Verify navigation state in RootNavigator

2. **Images not loading**
   - Ensure image URLs are valid
   - Check network connectivity
   - Verify base URL in constants

3. **Theme not persisting**
   - Check AsyncStorage permissions
   - Verify STORAGE_KEYS constant
   - Check theme loading in App.js

4. **Favorites not saving**
   - Verify AsyncStorage setup
   - Check JSON serialization
   - Ensure dispatch is working

## Environment Variables

Create `.env` file (if needed for production):
```
REACT_APP_API_BASE_URL=https://api.themoviedb.org/3
REACT_APP_API_KEY=your_key_here
```

## Build & Deployment

### For Android:
```bash
eas build --platform android
```

### For iOS:
```bash
eas build --platform ios
```

### For Web:
```bash
npm run web
```

## Code Style Guide

### File Naming
- Screens: `ScreenNameScreen.js`
- Components: `ComponentName.js`
- Services: `serviceName.js`
- Utilities: `utilityName.js`

### Component Structure
```javascript
// 1. Imports
import React from 'react';
import { View } from 'react-native';

// 2. Component
const Component = ({ prop1, prop2 }) => {
  return <View />;
};

// 3. Styles
const styles = StyleSheet.create({
  container: {}
});

// 4. Export
export default Component;
```

### Redux Action Naming
- `fetchDataStart` - Action starts
- `fetchDataSuccess` - Action succeeds
- `fetchDataFailure` - Action fails

## Performance Monitoring

Monitor with:
- React Native Debugger
- Redux DevTools
- Flipper
- Performance Profiler

## Future Enhancements

1. Add unit tests (Jest + React Native Testing Library)
2. Add E2E tests (Detox)
3. Implement CI/CD pipeline
4. Add error tracking (Sentry)
5. Add analytics (Firebase)
6. Implement notifications
7. Add offline support

---

**Happy Development! 🚀**

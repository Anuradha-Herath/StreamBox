# StreamBox - Architecture & Best Practices

## Application Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    App.js (Root)                        │
├─────────────────────────────────────────────────────────┤
│                  Redux Store Setup                      │
├─────────────────────────────────────────────────────────┤
│                  RootNavigator                          │
├──────────────────────┬──────────────────────────────────┤
│  AuthNavigator       │        AppNavigator              │
│  - LoginScreen       │  - HomeTab (StackNav)            │
│  - RegisterScreen    │  - FavoritesTab (StackNav)       │
│                      │  - ProfileTab (StackNav)         │
│                      │  - SettingsTab (StackNav)        │
└──────────────────────┴──────────────────────────────────┘
           │
           ├──→ Redux State (auth, movies, favorites, theme)
           ├──→ Services (API calls)
           ├──→ Components (Reusable UI)
           └──→ Utils (Validation, Constants)
```

## State Management (Redux)

### Auth Slice
```javascript
state.auth = {
  user: { id, username, email, firstName },
  token: string,
  isAuthenticated: boolean,
  isLoading: boolean,
  error: null | string
}

Actions:
- loginStart() → Set loading
- loginSuccess(user, token) → Set user & token
- loginFailure(error) → Set error
- logout() → Clear state
- setUser(user) → Set user
```

### Movies Slice
```javascript
state.movies = {
  movies: array,
  isLoading: boolean,
  error: null | string
}

Actions:
- fetchMoviesStart()
- fetchMoviesSuccess(movies)
- fetchMoviesFailure(error)
- setMovies(movies)
```

### Favorites Slice
```javascript
state.favorites = {
  favorites: array
}

Actions:
- addFavorite(movie) → Add to favorites
- removeFavorite(movieId) → Remove from favorites
- setFavorites(favorites) → Replace all
```

### Theme Slice
```javascript
state.theme = {
  isDarkMode: boolean
}

Actions:
- toggleTheme()
- setTheme(isDark)
```

## Navigation Structure

### Stack Navigation
Used for sequential screens:
- AuthStack: Login → Register
- HomeStack: Home → MovieDetails
- FavoritesStack: Favorites → MovieDetails

### Tab Navigation
Bottom tabs for main sections:
- HomeTab
- FavoritesTab
- ProfileTab
- SettingsTab

### Nested Navigation
```
RootNavigator
├── AuthStack
│   ├── LoginScreen
│   └── RegisterScreen
└── AppNavigator (BottomTabNavigator)
    ├── HomeStack
    │   ├── HomeScreen
    │   └── MovieDetailsScreen
    ├── FavoritesStack
    │   ├── FavoritesScreen
    │   └── MovieDetailsScreen
    ├── ProfileStack
    │   └── ProfileScreen
    └── SettingsStack
        └── SettingsScreen
```

## Component Hierarchy

### Screen Components
- Full-screen components
- Connect to Redux
- Handle navigation
- Manage local state with useState

### Feature Components
- Reusable across screens
- Isolated concerns
- Props-based styling
- Theme-aware

### UI Components
```
Button.js
├── Supports variants (primary, secondary, outline)
├── Multiple sizes (small, medium, large)
└── Theme-aware colors

TextInputField.js
├── Label support
├── Error messaging
└── Theme colors

MovieCard.js
├── Poster image
├── Title & overview
├── Rating display
└── Favorite toggle

Header.js
├── Menu button
├── Title
├── Theme toggle
└── Username display

SearchBar.js
├── Search icon
├── Text input
└── onChange callback

LoadingSpinner.js
├── Activity indicator
└── Loading message

ErrorBanner.js
├── Error message
└── Retry button
```

## Data Flow Patterns

### User Authentication Flow
```
User Input (Email, Password)
    ↓
LoginScreen validates input
    ↓
calls authService.login()
    ↓
API returns token
    ↓
Redux action: loginSuccess(user, token)
    ↓
Save to AsyncStorage
    ↓
Navigate to Home
```

### Movie Fetch Flow
```
HomeScreen mounts
    ↓
dispatch fetchMoviesStart()
    ↓
movieService.getTrendingMovies()
    ↓
dispatch fetchMoviesSuccess(movies) or fetchMoviesFailure(error)
    ↓
Redux state updated
    ↓
Component re-renders with movies
```

### Favorites Management Flow
```
User taps heart icon
    ↓
Check if movie is in favorites
    ↓
If yes: dispatch removeFavorite(movieId)
If no: dispatch addFavorite(movie)
    ↓
Save to AsyncStorage
    ↓
Update Redux state
    ↓
UI reflects change
```

### Theme Toggle Flow
```
User toggles dark mode in Settings
    ↓
dispatch toggleTheme()
    ↓
Save preference to AsyncStorage
    ↓
Redux state updates
    ↓
All components re-render with new theme
```

## Service Layer (API)

```javascript
// src/services/api.js

authService
├── login(email, password)
├── register(username, email, password)
└── logout()

movieService
├── getTrendingMovies()
├── getMovieDetails(movieId)
└── searchMovies(query)

// Axios interceptor for token attachment
apiClient.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem(TOKEN_KEY);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  }
);
```

## Validation Layer

```javascript
// src/utils/validation.js

loginValidationSchema (Yup)
├── email: valid email format required
└── password: min 6 chars, required

registerValidationSchema (Yup)
├── username: min 3 chars, required
├── email: valid format, required
├── password: min 6 chars, required
└── confirmPassword: must match password

Custom validators
├── validateEmail()
└── validatePassword()
```

## Storage Strategy

```
AsyncStorage
├── @streambox_auth_token (JWT token)
├── @streambox_user_data (User object)
├── @streambox_favorites (Favorites array)
└── @streambox_theme_mode (Dark mode boolean)
```

## Error Handling

```javascript
// Try-Catch at service level
try {
  const data = await movieService.getTrendingMovies();
} catch (error) {
  dispatch(fetchMoviesFailure(error.message));
}

// Error display to user
{error && (
  <ErrorBanner
    message={error}
    onRetry={retryFunction}
  />
)}
```

## Performance Optimizations

### Memoization
```javascript
const MovieCard = React.memo(({ movie, onPress }) => {
  // Component code
});
```

### Selectors
```javascript
const movies = useSelector(state => state.movies.movies);
const { isLoading, error } = useSelector(state => state.movies);
```

### Lazy Loading
```javascript
// Load images with placeholder
<Image
  source={{ uri: imageUrl }}
  defaultSource={require('./placeholder.png')}
/>
```

### FlatList Optimization
```javascript
<FlatList
  data={movies}
  renderItem={renderMovie}
  keyExtractor={item => item.id.toString()}
  initialNumToRender={10}
  maxToRenderPerBatch={5}
/>
```

## Styling Architecture

```javascript
// Theme system
themes.light = {
  primary: '#FF6B6B',
  secondary: '#4ECDC4',
  background: '#FFFFFF',
  surface: '#F7F7F7',
  text: '#2D3436',
  ...
}

themes.dark = {
  primary: '#FF6B6B',
  secondary: '#4ECDC4',
  background: '#1E1E1E',
  surface: '#2D2D2D',
  text: '#FFFFFF',
  ...
}

// Component usage
const theme = getTheme(isDarkMode);
<View style={{ backgroundColor: theme.background }} />
```

## Code Quality Standards

### Naming Conventions
```
Files: camelCase.js or PascalCase.js
Functions: camelCase()
Constants: UPPER_SNAKE_CASE
Components: PascalCase
Redux actions: camelCaseAction
```

### Component Structure
1. Imports
2. Component definition
3. Helper functions (inside component)
4. StyleSheet
5. Export

### Redux Slice Structure
1. initialState
2. createSlice with reducers
3. Export actions
4. Export reducer

## Testing Strategy

### Unit Tests
```javascript
// Test reducer
test('should add favorite', () => {
  const action = addFavorite(mockMovie);
  const result = favoritesReducer(initialState, action);
  expect(result.favorites).toContain(mockMovie);
});
```

### Component Tests
```javascript
// Test UI interaction
test('should call onPress when movie card tapped', () => {
  const { getByTestId } = render(<MovieCard />);
  fireEvent.press(getByTestId('movieCard'));
});
```

### Integration Tests
```javascript
// Test navigation
test('should navigate to details on movie tap', async () => {
  const { getByText } = render(<HomeScreen />);
  fireEvent.press(getByText('Movie Title'));
});
```

## Deployment Considerations

### APK/AAB (Android)
```bash
eas build --platform android --auto-submit
```

### IPA (iOS)
```bash
eas build --platform ios
```

### Web
```bash
npm run web
```

## Security Considerations

- ✅ Use HTTPS for all API calls
- ✅ Validate all user inputs
- ✅ Don't store sensitive data in Redux
- ✅ Clear auth tokens on logout
- ✅ Use secure AsyncStorage methods
- ✅ Implement rate limiting for API calls
- ✅ Sanitize error messages

## Monitoring & Analytics

Implement in production:
- Error tracking (Sentry)
- Analytics (Firebase)
- Performance monitoring (Datadog)
- User behavior tracking
- Crash reporting

---

**Architecture Document Complete! 🏗️**

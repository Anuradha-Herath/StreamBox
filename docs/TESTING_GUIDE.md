# StreamBox Authentication - Testing Guide

## 🧪 Manual Testing Procedures

### Pre-Testing Setup
1. Ensure your backend API is running
2. Update `REACT_APP_API_URL` in `.env` or `src/services/api.js`
3. Clear AsyncStorage before each test cycle:
   ```javascript
   // In App.js or debug console
   import AsyncStorage from '@react-native-async-storage/async-storage';
   AsyncStorage.clear();
   ```

---

## 📝 Test Cases

### Test 1: Login with Valid Credentials
**Expected Outcome:** User successfully logs in and navigates to AppStack

```
Steps:
1. Navigate to LoginScreen
2. Enter valid email: test@example.com
3. Enter valid password: TestPass123!
4. Tap "Login" button
5. Wait for API response

Expected Results:
✓ Loading spinner appears while logging in
✓ No error banner visible
✓ After login, user sees AppStack (HomeScreen)
✓ Header displays user's first name
✓ User avatar shows in header
✓ Logout button appears in header
```

**Redux State Check:**
```javascript
state.auth = {
  isAuthenticated: true,
  user: { id, email, username, firstName, lastName, avatar },
  token: "jwt-token",
  refreshToken: "refresh-token",
  error: null
}
```

---

### Test 2: Login with Invalid Email
**Expected Outcome:** Error message displayed

```
Steps:
1. Navigate to LoginScreen
2. Enter invalid email: notanemail
3. Leave password empty
4. Try to click Login button

Expected Results:
✓ Submit button is disabled (form invalid)
✓ Error message shows under email field: "Invalid email address"
✓ No API call is made
```

---

### Test 3: Login with Wrong Password
**Expected Outcome:** API error displayed

```
Steps:
1. Navigate to LoginScreen
2. Enter email: test@example.com
3. Enter password: WrongPassword123!
4. Tap "Login" button

Expected Results:
✓ Loading spinner appears
✓ Error banner displays: "Invalid email or password"
✓ User remains on LoginScreen
✓ User can retry login
```

---

### Test 4: Registration with Valid Data
**Expected Outcome:** New account created and user auto-logged in

```
Steps:
1. Navigate to RegisterScreen
2. Enter username: newuser
3. Enter email: newuser@example.com
4. Enter password: ValidPass123!
5. Confirm password: ValidPass123!
6. Tap "Register" button

Expected Results:
✓ Password strength bar appears (green = strong)
✓ All password requirements checked
✓ Loading spinner appears during registration
✓ After success, user navigates to AppStack
✓ Header shows new user's name
✓ User data saved to AsyncStorage
```

---

### Test 5: Registration with Weak Password
**Expected Outcome:** Real-time feedback and form validation

```
Steps:
1. Navigate to RegisterScreen
2. Enter username: testuser
3. Enter email: test@example.com
4. Start typing password: pass
5. Watch feedback

Expected Results:
✓ Password strength bar appears (red = weak)
✓ Feedback shows missing requirements:
  ○ At least 8 characters
  ○ At least one uppercase letter
  ○ At least one number
  ○ At least one special character
✓ Submit button remains disabled until requirements met
```

---

### Test 6: Registration with Duplicate Email
**Expected Outcome:** Error message from backend

```
Steps:
1. Navigate to RegisterScreen
2. Enter username: anotheruser
3. Enter email: test@example.com (already registered)
4. Enter password: ValidPass123!
5. Confirm password: ValidPass123!
6. Tap "Register" button

Expected Results:
✓ Loading spinner appears
✓ Error banner displays: "Email is already registered"
✓ User remains on RegisterScreen
✓ Can modify fields and retry
```

---

### Test 7: Session Restoration on App Launch
**Expected Outcome:** Already logged-in users see AppStack without re-entering credentials

```
Steps:
1. Login successfully (Test 1)
2. Close the app completely
3. Reopen the app

Expected Results:
✓ Loading spinner appears briefly
✓ App navigates to AppStack
✓ Header shows logged-in user's name
✓ No need to login again
✓ User data loaded from AsyncStorage
```

---

### Test 8: Token Refresh on Expired Token
**Expected Outcome:** Transparent token refresh and request retry

```
Steps:
1. Login successfully
2. Wait for access token to expire (or mock expiration)
3. Make any API request (e.g., navigate to different screen)

Expected Results:
✓ API call catches 401 error
✓ Interceptor calls /auth/refresh endpoint
✓ New token received and saved
✓ Original request retried with new token
✓ User sees no interruption
✓ New tokens stored in AsyncStorage
```

---

### Test 9: Logout Functionality
**Expected Outcome:** User logged out and returned to AuthStack

```
Steps:
1. Login successfully
2. Tap logout button in header
3. Confirm logout action

Expected Results:
✓ Loading spinner appears
✓ User redirected to LoginScreen
✓ Redux auth state cleared
✓ AsyncStorage tokens removed
✓ User data removed from Redux
✓ Cannot access AppStack without login
```

---

### Test 10: Network Error Handling
**Expected Outcome:** Graceful error message

```
Steps:
1. Disable internet connection
2. Navigate to LoginScreen
3. Enter credentials
4. Tap "Login" button

Expected Results:
✓ After timeout, error banner shows
✓ User-friendly error message displayed
✓ User can retry when connection restored
```

---

## 🔍 State Verification Tests

### Redux State Check

**After Login:**
```javascript
// Access in React DevTools Redux tab
state = {
  auth: {
    isAuthenticated: true,
    user: {
      id: "user-123",
      email: "test@example.com",
      username: "testuser",
      firstName: "Test",
      lastName: "User",
      avatar: null
    },
    token: "eyJhbGciOiJIUzI1NiIs...",
    refreshToken: "eyJhbGciOiJIUzI1NiIs...",
    isLoading: false,
    error: null,
    lastLoginTime: "2024-01-15T10:30:00Z"
  }
}
```

### AsyncStorage Check

```javascript
// In React Native debugger or console
import AsyncStorage from '@react-native-async-storage/async-storage';

AsyncStorage.getAllKeys().then(keys => {
  console.log('Stored keys:', keys);
  // Should show:
  // ['@streambox_auth_token', '@streambox_refresh_token', '@streambox_user_data', ...]
});

// Check token
AsyncStorage.getItem('@streambox_auth_token').then(token => {
  console.log('Token:', token); // Should be a JWT string
});

// Check user data
AsyncStorage.getItem('@streambox_user_data').then(userData => {
  console.log('User:', JSON.parse(userData));
});
```

---

## 🐛 Debug Tips

### Enable Network Logging
```javascript
// Add to api.js for debugging
apiClient.interceptors.request.use(req => {
  console.log('[API] Request:', req.method.toUpperCase(), req.url, req.data);
  return req;
});

apiClient.interceptors.response.use(
  res => {
    console.log('[API] Response:', res.status, res.data);
    return res;
  },
  err => {
    console.log('[API] Error:', err.response?.status, err.response?.data);
    return Promise.reject(err);
  }
);
```

### Monitor Redux Actions
```javascript
// Add logger middleware to store
import logger from 'redux-logger';

const store = configureStore({
  reducer: {
    // ... reducers
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(logger),
});
```

### Check AsyncStorage
```javascript
// Debug AsyncStorage contents
async function debugStorage() {
  const keys = await AsyncStorage.getAllKeys();
  console.log('Keys:', keys);
  
  for (let key of keys) {
    const value = await AsyncStorage.getItem(key);
    console.log(`${key}:`, value);
  }
}

debugStorage();
```

---

## ✅ Test Checklist

### Authentication Flow
- [ ] User can login with valid credentials
- [ ] User cannot login with invalid credentials
- [ ] User sees appropriate error messages
- [ ] User can register with valid data
- [ ] Password strength indicator works
- [ ] User cannot register with weak password
- [ ] Duplicate email prevention works
- [ ] User can logout

### Session Management
- [ ] User session persists on app restart
- [ ] User data displays in header
- [ ] User avatar shows correctly
- [ ] User info updates from backend
- [ ] Session clears on logout

### Token Management
- [ ] Tokens stored in AsyncStorage
- [ ] Token refresh works automatically
- [ ] Old tokens cleared on logout
- [ ] New tokens generated on refresh
- [ ] Token expires appropriately

### Form Validation
- [ ] Email validation works
- [ ] Password requirements enforced
- [ ] Username validation works
- [ ] Real-time error messages
- [ ] Submit button disabled until valid

### Error Handling
- [ ] Network errors handled gracefully
- [ ] Server errors show friendly messages
- [ ] Validation errors display inline
- [ ] Error messages clearable
- [ ] Retry logic works

### Security
- [ ] Passwords not logged to console
- [ ] Tokens not exposed in logs
- [ ] Tokens cleared on logout
- [ ] No hardcoded credentials
- [ ] HTTPS enforced in production

---

## 🚀 Performance Testing

### Test: Login Response Time
```
Objective: Ensure login completes in < 5 seconds

Steps:
1. Open Network tab in DevTools
2. Clear Network logs
3. Click Login
4. Measure time to response

Expected: < 5 seconds for complete login
```

### Test: App Launch with Session
```
Objective: Ensure app loads quickly with existing session

Steps:
1. Login and close app
2. Use Xcode/Android Studio performance profiler
3. Relaunch app
4. Measure time to AppStack display

Expected: < 3 seconds for app startup
```

---

## 📊 Test Results Template

```
Test Date: _______________
Backend URL: _______________
App Version: _______________

Test Results:
[ ] Test 1: Login - Valid Credentials       PASS / FAIL
[ ] Test 2: Login - Invalid Email           PASS / FAIL
[ ] Test 3: Login - Wrong Password          PASS / FAIL
[ ] Test 4: Registration - Valid Data       PASS / FAIL
[ ] Test 5: Registration - Weak Password    PASS / FAIL
[ ] Test 6: Registration - Duplicate Email  PASS / FAIL
[ ] Test 7: Session Restoration             PASS / FAIL
[ ] Test 8: Token Refresh                   PASS / FAIL
[ ] Test 9: Logout                          PASS / FAIL
[ ] Test 10: Network Error Handling         PASS / FAIL

Issues Found:
1. _________________________________
2. _________________________________

Notes:
_________________________________
```

---

## 🔗 Related Documentation

- [AUTHENTICATION_IMPLEMENTATION_GUIDE.md](./AUTHENTICATION_IMPLEMENTATION_GUIDE.md)
- [BACKEND_SETUP_GUIDE.md](./BACKEND_SETUP_GUIDE.md)
- [DEVELOPMENT.md](./DEVELOPMENT.md)

---

**Last Updated:** November 2024

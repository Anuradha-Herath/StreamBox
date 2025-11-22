# StreamBox - DummyJSON Authentication Integration Guide

## Overview

StreamBox is now configured to use **DummyJSON** API for authentication testing and development. This guide explains how to use the DummyJSON auth endpoints.

---

## 🚀 Quick Start

### Test Credentials

**Available Test Users (from DummyJSON):**

| Username | Password | Name |
|----------|----------|------|
| `emilys` | `emilyspass` | Emily Johnson |
| `michaelw` | `michaelwpass` | Michael Wilson |
| `harryp` | `harryppass` | Harry Potter |
| `atuny0` | `9uQFF980A` | Athanasios Reilly |
| `hbingley1` | `CQutQ34Mx` | Haines Bingley |

**More users available:** https://dummyjson.com/users

---

## 📡 API Endpoints

### 1. Login
```
POST https://dummyjson.com/auth/login

Request Body:
{
  "username": "emilys",
  "password": "emilyspass",
  "expiresInMins": 30
}

Response:
{
  "id": 1,
  "username": "emilys",
  "email": "emily.johnson@x.dummyjson.com",
  "firstName": "Emily",
  "lastName": "Johnson",
  "gender": "female",
  "image": "https://dummyjson.com/icon/emilys/128",
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### 2. Get Current User
```
GET https://dummyjson.com/auth/me
Authorization: Bearer <accessToken>

Response:
{
  "id": 1,
  "username": "emilys",
  "email": "emily.johnson@x.dummyjson.com",
  "firstName": "Emily",
  "lastName": "Johnson",
  "gender": "female",
  "image": "https://dummyjson.com/icon/emilys/128"
}
```

### 3. Refresh Token
```
POST https://dummyjson.com/auth/refresh

Request Body:
{
  "refreshToken": "<your_refresh_token>",
  "expiresInMins": 30
}

Response:
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

---

## 🔧 Implementation Details

### Token Storage

**Access Token:**
- Stored in AsyncStorage as `@streambox_auth_token`
- Short-lived (expires based on `expiresInMins` parameter)
- Used in `Authorization: Bearer <token>` header

**Refresh Token:**
- Stored in AsyncStorage as `@streambox_refresh_token`
- Long-lived (typically 7-30 days)
- Used to obtain new access tokens

### Request Interceptor

All API requests automatically include the access token:

```javascript
// Automatic header injection
Authorization: Bearer <accessToken>
```

### Response Interceptor

Token refresh is handled automatically:

1. If API returns 401 (Unauthorized)
2. Check if refresh token is available
3. Call `/auth/refresh` endpoint
4. Get new access token
5. Retry original request
6. No user interruption

---

## 🧪 Testing

### Test Login
```bash
curl -X POST https://dummyjson.com/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "emilys",
    "password": "emilyspass",
    "expiresInMins": 30
  }'
```

### Test Get Current User
```bash
curl https://dummyjson.com/auth/me \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### Test Refresh Token
```bash
curl -X POST https://dummyjson.com/auth/refresh \
  -H "Content-Type: application/json" \
  -d '{
    "refreshToken": "YOUR_REFRESH_TOKEN",
    "expiresInMins": 30
  }'
```

---

## 📱 App Integration

### Login Flow

1. User enters username (e.g., `emilys`)
2. User enters password
3. App calls `/auth/login` endpoint
4. Tokens received and stored locally
5. User data saved to Redux
6. User navigated to AppStack
7. Header displays user info

**Example:**
```
Username: emilys
Password: emilyspass
↓
{ accessToken, refreshToken, user }
↓
Stored in AsyncStorage
↓
User logged in ✓
```

### Session Restoration

1. App launches
2. RootNavigator checks AsyncStorage for tokens
3. If tokens exist, calls `/auth/me`
4. Validates token and restores session
5. User sees AppStack without re-login

### Automatic Token Refresh

1. Any API request returns 401
2. Interceptor catches error
3. Calls `/auth/refresh` with refresh token
4. Receives new access token
5. Retries original request
6. User experience uninterrupted

---

## 🔐 Security Considerations

### DummyJSON for Development Only

DummyJSON is perfect for:
- ✅ Learning and testing
- ✅ Development and prototyping
- ✅ Understanding auth flows
- ✅ Building UI components

DummyJSON is NOT suitable for:
- ❌ Production applications
- ❌ Real user data
- ❌ Sensitive information
- ❌ Compliance requirements

### Security Features Implemented

✅ **Token Management:**
- Tokens stored in AsyncStorage
- Automatic refresh on expiration
- Tokens cleared on logout

✅ **Request Security:**
- All requests include Authorization header
- Token automatically attached
- Credentials included in requests

✅ **Error Handling:**
- Session expiration detected
- User redirected to login
- Error messages user-friendly

---

## 🚀 Migrating to Real Backend

When ready to use a real backend, follow these steps:

### Step 1: Create Backend Endpoints

Implement these endpoints on your backend:

```
POST   /auth/login       # Returns { accessToken, refreshToken, user }
GET    /auth/me          # Returns current user profile
POST   /auth/refresh     # Returns new tokens
POST   /auth/logout      # Optional: invalidate tokens
POST   /auth/register    # Optional: create new user
```

### Step 2: Update API Configuration

Edit `src/services/api.js`:

```javascript
// Change from:
const BACKEND_API_URL = DUMMY_API_BASE_URL;

// To:
const BACKEND_API_URL = 'https://your-backend.com/api';
```

Or use environment variable:

```javascript
const BACKEND_API_URL = process.env.REACT_APP_API_URL || DUMMY_API_BASE_URL;
```

### Step 3: Update Validation Schema

If your backend has different requirements, update:
`src/utils/validation.js`

### Step 4: Test Integration

1. Update test credentials
2. Test login flow
3. Verify token refresh
4. Test session restoration
5. Verify logout

---

## 📚 DummyJSON Resources

- **Official Site:** https://dummyjson.com
- **Auth Docs:** https://dummyjson.com/docs/auth
- **Users List:** https://dummyjson.com/users
- **API Reference:** https://dummyjson.com/docs

---

## ❓ Troubleshooting

### Issue: "Invalid username or password"
**Solution:** Check username is correct (case-sensitive). Available users: emilys, michaelw, harryp, etc.

### Issue: Token expired
**Solution:** Token will be automatically refreshed. Check that refresh token is stored properly in AsyncStorage.

### Issue: Session not persisting
**Solution:** 
1. Verify tokens are saved to AsyncStorage
2. Check RootNavigator is calling `setUser`
3. Verify user data is being returned from `/auth/me`

### Issue: Login button always disabled
**Solution:** 
1. Check validation schema in `validation.js`
2. DummyJSON expects username, not email
3. Verify field is accepting username format

### Issue: "Can't connect to API"
**Solution:**
1. Check internet connection
2. Verify DUMMY_API_BASE_URL is correct
3. DummyJSON should be accessible from your network

---

## 🔗 Related Files

- `src/services/api.js` - API configuration and endpoints
- `src/screens/LoginScreen.js` - Login form
- `src/screens/RegisterScreen.js` - Registration (mock for DummyJSON)
- `src/navigation/RootNavigator.js` - Session restoration
- `src/redux/authSlice.js` - Redux state management
- `src/utils/validation.js` - Input validation

---

## 📝 Example cURL Commands

### Login Example
```bash
curl -X POST https://dummyjson.com/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "emilys",
    "password": "emilyspass",
    "expiresInMins": 30
  }'
```

### Get Profile Example
```bash
curl https://dummyjson.com/auth/me \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

---

## ✅ Verification Checklist

- [ ] Login works with DummyJSON credentials
- [ ] User info displays in header after login
- [ ] Token refresh works on 401 response
- [ ] Session restores on app restart
- [ ] Logout clears all data
- [ ] User can re-login after logout
- [ ] Error messages display correctly
- [ ] Loading states show during API calls

---

## 🎯 Next Steps

1. **Test Current Setup:**
   - Login with `emilys` / `emilyspass`
   - Verify header shows user info
   - Test logout

2. **Understand Token Flow:**
   - Monitor tokens in AsyncStorage
   - Check Redux state in DevTools
   - Test token refresh manually

3. **Prepare for Production:**
   - Plan backend API
   - Document endpoints
   - Plan migration strategy

---

**Last Updated:** November 21, 2024
**Status:** ✅ DummyJSON Integration Complete
**Test Credentials:** Available in login screen

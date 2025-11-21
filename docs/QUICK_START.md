# 🎬 StreamBox - Quick Start Guide

## What is StreamBox?

StreamBox is a professional, production-ready React Native mobile application that demonstrates modern mobile development practices. It includes:

- ✅ User Authentication (Login/Register)
- ✅ Movie Database with Search
- ✅ Favorites Management with Persistence
- ✅ Dark Mode Support
- ✅ Redux State Management
- ✅ Beautiful UI with Feather Icons
- ✅ Comprehensive Navigation
- ✅ Form Validation
- ✅ Error Handling

## 🚀 Quick Start (5 minutes)

### Step 1: Install Dependencies
```bash
cd StreamBox
npm install
```

### Step 2: Start the App
```bash
npm start
```

### Step 3: Run on Device/Emulator

**Android:**
```bash
npm run android
```

**iOS (macOS only):**
```bash
npm run ios
```

**Web:**
```bash
npm run web
```

## 📱 First Steps in App

1. **Login Screen** (Opens automatically)
   - Use demo credentials:
     - Email: `user@example.com`
     - Password: `password123`
   - OR create a new account via Register

2. **Home Screen** (After login)
   - Browse trending movies
   - Search for movies
   - Tap any movie for details
   - Heart icon to add to favorites

3. **Favorites Tab**
   - View all your saved movies
   - Remove from favorites
   - Tap to see details

4. **Profile Tab**
   - View your account info
   - See your activity stats

5. **Settings Tab**
   - Toggle dark mode
   - Change theme
   - Logout

## 🔑 Key Features Explained

### Authentication System
```
Login → Validate Email/Password → Store Token → Navigate to Home
```

### Movie Management
```
Fetch Movies → Display List → User Selects Movie → Show Details → Option to Add to Favorites
```

### Favorites Persistence
```
Add to Favorites → Save to AsyncStorage → Reload App → Favorites Still Available
```

### Theme System
```
Toggle in Settings → Apply to All Screens → Persist Preference → Auto-load on Startup
```

## 📂 Important Files to Know

| File | Purpose |
|------|---------|
| `App.js` | Root component & Redux setup |
| `src/redux/store.js` | Redux configuration |
| `src/navigation/RootNavigator.js` | Navigation logic |
| `src/screens/` | All app screens |
| `src/services/api.js` | API calls |
| `src/utils/` | Constants & validation |

## 🎨 Customization

### Change App Colors
Edit `src/styles/theme.js`:
```javascript
primary: '#FF6B6B',  // Change this color
secondary: '#4ECDC4'  // And this
```

### Add New Screen
1. Create file in `src/screens/NewScreen.js`
2. Add to navigation in `src/navigation/AppNavigator.js`
3. Add route in Redux if needed

### Change API Data
Edit `src/services/api.js` to:
- Use real TMDB API
- Change endpoints
- Modify data structure

## 🐛 Troubleshooting

**Issue:** Blank white screen after login
- Solution: Check `src/navigation/AppNavigator.js` is properly set up

**Issue:** Images not showing
- Solution: Verify image URLs in `src/services/api.js`

**Issue:** Favorites not saving
- Solution: Check AsyncStorage permissions in `app.json`

**Issue:** Can't login
- Solution: Make sure Redux store is initialized in `App.js`

## 📚 Project Structure

```
StreamBox/
├── src/
│   ├── screens/        ← All app screens
│   ├── navigation/     ← Navigation setup
│   ├── redux/          ← State management
│   ├── services/       ← API calls
│   ├── components/     ← Reusable UI
│   ├── utils/          ← Helpers & constants
│   └── styles/         ← Theme & colors
├── App.js              ← Root component
├── app.json            ← Expo config
└── package.json        ← Dependencies
```

## 💡 Pro Tips

1. **Use Redux DevTools** for debugging state changes
2. **Check console logs** when something breaks
3. **Enable Fast Refresh** for quick development
4. **Test on physical device** for better accuracy
5. **Use Expo Go app** for quick testing

## 🔒 Security Notes

- Tokens are stored in AsyncStorage
- Passwords validated with Yup
- No credentials hardcoded
- Form inputs properly validated
- Authentication required for most screens

## 📦 Dependencies Installed

- React Navigation (Navigation)
- Redux Toolkit (State Management)
- Yup (Form Validation)
- Axios (API Calls)
- AsyncStorage (Local Storage)
- React Native Feather (Icons)

## 🎯 Learning Outcomes

After exploring this project, you'll understand:
- ✅ React Native fundamentals
- ✅ Redux Toolkit setup
- ✅ React Navigation patterns
- ✅ Form validation in mobile
- ✅ Async storage & persistence
- ✅ Dark mode implementation
- ✅ API integration
- ✅ State management best practices
- ✅ Mobile UI patterns
- ✅ Component reusability

## 🚀 Next Steps

1. **Explore the code** - Open files and read comments
2. **Try modifying** - Change colors, add new screens
3. **Integrate real API** - Follow `API_INTEGRATION.md`
4. **Add features** - See `DEVELOPMENT.md` for patterns
5. **Deploy** - Use Expo or build with EAS

## 📞 Need Help?

- Check `README.md` for detailed info
- See `DEVELOPMENT.md` for architecture
- Read `API_INTEGRATION.md` for API setup
- Check code comments throughout

## 🎉 You're All Set!

The app is ready to run. Start it with `npm start` and explore!

---

**Happy Coding! 🚀**

# StreamBox 🎬

A fully-functional React Native entertainment application built with Expo, featuring movie browsing, user authentication, favorites management, and dark mode support.

## Features

- 🔐 User Authentication (Login/Register)
- 🎥 Movie Database with Search Functionality
- ❤️ Favorites Management with Persistence
- 🌙 Dark Mode Support
- 📱 Responsive Design for Mobile Devices
- 🔄 Redux State Management
- 🎨 Beautiful UI with Feather Icons
- 🧭 Comprehensive Navigation
- ✅ Form Validation with Yup
- 🚨 Error Handling and Loading States

## Getting Started

### Prerequisites

- Node.js (version 18 or later)
- npm or yarn
- Expo CLI

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Anuradha-Herath/StreamBox.git
   cd StreamBox
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

### Running the App

- **Android Emulator**: `npm run android`
- **iOS Simulator** (macOS only): `npm run ios`
- **Web Browser**: `npm run web`

## Demo Credentials

- Username: `emilys`
- Password: `emilyspass`

*Note: These are test credentials from the DummyJSON API. More users are available at [dummyjson.com/users](https://dummyjson.com/users)*

## Tech Stack

- **Framework**: React Native with Expo
- **State Management**: Redux Toolkit
- **Navigation**: React Navigation
- **Forms**: Formik with Yup validation
- **HTTP Client**: Axios
- **Storage**: AsyncStorage
- **Icons**: Feather Icons
- **Styling**: React Native StyleSheet with custom theme

## Project Structure

```
StreamBox/
├── src/
│   ├── components/     # Reusable UI components
│   ├── screens/        # App screens
│   ├── navigation/     # Navigation configuration
│   ├── redux/          # State management
│   ├── services/       # API services
│   ├── styles/         # Theme and styling
│   └── utils/          # Utilities and constants
├── docs/               # Documentation
├── App.js              # Root component
└── package.json        # Dependencies and scripts
```

## Documentation

- [Quick Start Guide](docs/QUICK_START.md)
- [Development Guide](docs/DEVELOPMENT.md)
- [Architecture Overview](docs/ARCHITECTURE.md)
- [API Integration](docs/API_INTEGRATION.md)
- [Authentication Guide](docs/AUTHENTICATION_IMPLEMENTATION_GUIDE.md)
- [Features Checklist](docs/FEATURES_CHECKLIST.md)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## License

This project is for educational and demonstration purposes.

## Learn More

- [Expo Documentation](https://docs.expo.dev/)
- [React Native Documentation](https://reactnative.dev/docs/getting-started)
- [Redux Toolkit Documentation](https://redux-toolkit.js.org/)

---

Built with ❤️ using React Native and Expo.

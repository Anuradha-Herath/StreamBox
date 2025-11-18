# StreamBox - Git Commit Guide

## Commit Convention

This project follows feature-based commits for clear project history.

## Commit Types

### 🎉 Features (feat)
New functionality for the application
```bash
git commit -m "feat: add user authentication with JWT"
git commit -m "feat: implement dark mode toggle"
git commit -m "feat: add favorites persistence"
```

### 🐛 Bug Fixes (fix)
Bug fixes and corrections
```bash
git commit -m "fix: correct navigation bug in HomeScreen"
git commit -m "fix: resolve AsyncStorage persist issue"
git commit -m "fix: fix image loading error handling"
```

### 🎨 Style Changes (style)
Code style, formatting, missing semicolons, etc.
```bash
git commit -m "style: update button styling"
git commit -m "style: align component spacing"
```

### ♻️ Refactoring (refactor)
Code changes that don't add features or fix bugs
```bash
git commit -m "refactor: extract Header component"
git commit -m "refactor: simplify API service"
```

### 📚 Documentation (docs)
Documentation updates
```bash
git commit -m "docs: update README with setup instructions"
git commit -m "docs: add API integration guide"
```

### 🧪 Tests (test)
Adding or updating tests
```bash
git commit -m "test: add LoginScreen tests"
git commit -m "test: add Redux reducer tests"
```

### ⚙️ Configuration (chore)
Build process, dependencies, configs
```bash
git commit -m "chore: add ESLint configuration"
git commit -m "chore: update dependencies"
```

## Commit History

### Phase 1: Setup
```
chore: initialize React Native project with Expo
chore: install core dependencies (Redux, Navigation, etc)
```

### Phase 2: Authentication
```
feat: implement login screen with validation
feat: implement register screen with validation
feat: add login/register API service
feat: add Redux auth state management
feat: add token persistence with AsyncStorage
```

### Phase 3: Navigation
```
feat: setup React Navigation with bottom tabs
feat: implement stack navigation for details
feat: create app and auth navigators
```

### Phase 4: Movie Features
```
feat: create home screen with movie list
feat: add search functionality
feat: implement movie details screen
feat: add movie card component
```

### Phase 5: Favorites
```
feat: add favorites management Redux slice
feat: implement favorites persistence
feat: create favorites screen
feat: add add-to-favorites functionality
```

### Phase 6: UI & Styling
```
feat: implement dark mode toggle
style: create consistent theme system
feat: add Feather icons throughout
style: ensure responsive design
```

### Phase 7: Components & Utils
```
feat: create reusable Button component
feat: create reusable TextInputField component
feat: add form validation with Yup
feat: add LoadingSpinner component
feat: add ErrorBanner component
```

### Phase 8: Polish
```
feat: add user profile screen
feat: add settings screen
docs: add comprehensive README
docs: add development guide
docs: add API integration guide
fix: resolve navigation issues
```

## Example Good Commits

### ✅ Good
```
feat: add favorites persistence to AsyncStorage

- Store favorites array in AsyncStorage
- Load favorites on app startup
- Sync favorites across app
- Add error handling for storage operations
```

### ✅ Good
```
fix: resolve image loading in MovieCard

- Add fallback placeholder image
- Improve error handling
- Add loading state indicator
```

### ❌ Bad
```
update stuff
fixed bugs
changes
```

## Branching Strategy (Optional)

If using branches:
```
main              - Production-ready code
├── develop       - Development branch
├── feature/*     - Feature branches
├── fix/*         - Bug fix branches
└── docs/*        - Documentation branches
```

## Push Guidelines

1. **Before pushing:**
   ```bash
   git status
   git log --oneline -5
   ```

2. **Make sure commits are atomic** (one feature per commit)

3. **Write meaningful messages** (future you will thank present you)

4. **Test before pushing**
   ```bash
   npm start
   # Test the app
   ```

## Useful Git Commands

```bash
# View commit history
git log --oneline

# View detailed history
git log -p

# View changes before committing
git diff

# Amend last commit
git commit --amend

# Revert last commit
git reset HEAD~1

# Create a new branch
git checkout -b feature/new-feature

# View current branch
git branch

# Switch branch
git checkout branch-name

# Merge branch
git merge branch-name
```

## Commit Checklist

Before committing, ensure:
- [ ] Code is tested
- [ ] Related files are included
- [ ] Commit message is clear and concise
- [ ] No unrelated changes in commit
- [ ] Console has no errors
- [ ] App runs without issues

## Tips for Good Commits

1. **Commit frequently** - One feature per commit
2. **Meaningful messages** - Someone should understand what you did
3. **Atomic commits** - Each commit should be independently functional
4. **Test before commit** - No broken commits
5. **Related files** - Keep related changes together

---

**Keep your git history clean! 📝**

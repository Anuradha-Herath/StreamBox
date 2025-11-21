# Backend API Setup Guide for StreamBox Authentication

## Quick Start

This guide helps you set up a backend API for StreamBox authentication. Choose your preferred technology stack.

---

## 📋 Required Endpoints

### Authentication Endpoints

#### 1. Login
```
POST /auth/login
Content-Type: application/json

Request:
{
  "email": "user@example.com",
  "password": "Password123!"
}

Response (200 OK):
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "user-123",
    "email": "user@example.com",
    "username": "johndoe",
    "firstName": "John",
    "lastName": "Doe",
    "avatar": null
  }
}

Response (401 Unauthorized):
{
  "code": "LOGIN_ERROR",
  "message": "Invalid email or password",
  "errors": {
    "email": "User not found",
    "password": "Incorrect password"
  }
}
```

#### 2. Register
```
POST /auth/register
Content-Type: application/json

Request:
{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "Password123!"
}

Response (201 Created):
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "user-456",
    "email": "john@example.com",
    "username": "johndoe",
    "firstName": "johndoe",
    "lastName": "",
    "avatar": null
  }
}

Response (400 Bad Request):
{
  "code": "REGISTER_ERROR",
  "message": "Registration failed",
  "errors": {
    "email": "Email is already registered",
    "password": "Password must contain uppercase, lowercase, number, and special character",
    "username": "Username already taken"
  }
}
```

#### 3. Refresh Token
```
POST /auth/refresh
Content-Type: application/json

Request:
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
}

Response (200 OK):
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
}

Response (401 Unauthorized):
{
  "code": "TOKEN_EXPIRED",
  "message": "Refresh token has expired"
}
```

#### 4. Logout
```
POST /auth/logout
Authorization: Bearer <token>

Response (200 OK):
{
  "message": "Logged out successfully"
}
```

#### 5. Get Profile
```
GET /auth/profile
Authorization: Bearer <token>

Response (200 OK):
{
  "id": "user-123",
  "email": "user@example.com",
  "username": "johndoe",
  "firstName": "John",
  "lastName": "Doe",
  "avatar": null,
  "createdAt": "2024-01-15T10:30:00Z",
  "updatedAt": "2024-01-20T15:45:00Z"
}

Response (401 Unauthorized):
{
  "code": "TOKEN_EXPIRED",
  "message": "Token has expired"
}
```

#### 6. Update Profile
```
PUT /auth/profile
Authorization: Bearer <token>
Content-Type: application/json

Request:
{
  "firstName": "Jonathan",
  "lastName": "Doe",
  "avatar": "https://..."
}

Response (200 OK):
{
  "id": "user-123",
  "email": "user@example.com",
  "username": "johndoe",
  "firstName": "Jonathan",
  "lastName": "Doe",
  "avatar": "https://..."
}
```

---

## 🔑 Token Format

### JWT Claims (Access Token - Short-lived, 15-60 minutes)
```json
{
  "sub": "user-123",
  "email": "user@example.com",
  "username": "johndoe",
  "iat": 1705326600,
  "exp": 1705330200
}
```

### Refresh Token (Long-lived, 7-30 days)
```json
{
  "sub": "user-123",
  "type": "refresh",
  "iat": 1705326600,
  "exp": 1710510600
}
```

---

## 🔍 Validation Rules

### Email
- Valid email format
- Must be unique in database
- Case-insensitive for lookup

### Username
- 3-30 characters
- Alphanumeric, underscore (_), hyphen (-)
- Must be unique in database
- Case-insensitive for lookup

### Password
- Minimum 8 characters
- At least one uppercase letter (A-Z)
- At least one lowercase letter (a-z)
- At least one number (0-9)
- At least one special character (@$!%*?&)
- Never store plain text
- Hash with bcrypt (minimum 10 rounds)

---

## 🚀 Implementation Examples

### Node.js + Express + MongoDB

```javascript
// Install dependencies
npm install express bcryptjs jsonwebtoken mongoose dotenv cors

// .env file
DATABASE_URL=mongodb://localhost:27017/streambox
JWT_SECRET=your-super-secret-jwt-key-change-this
JWT_REFRESH_SECRET=your-super-secret-refresh-key-change-this
JWT_EXPIRATION=3600
REFRESH_TOKEN_EXPIRATION=604800

// models/User.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 8
  },
  firstName: String,
  lastName: String,
  avatar: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Method to compare passwords
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);

// routes/auth.js
const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({
        code: 'LOGIN_ERROR',
        message: 'Invalid email or password'
      });
    }

    const token = jwt.sign(
      { sub: user._id, email: user.email, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRATION }
    );

    const refreshToken = jwt.sign(
      { sub: user._id, type: 'refresh' },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: process.env.REFRESH_TOKEN_EXPIRATION }
    );

    res.json({
      token,
      refreshToken,
      user: {
        id: user._id,
        email: user.email,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        avatar: user.avatar
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Register
router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Validate password
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        code: 'REGISTER_ERROR',
        message: 'Password does not meet requirements',
        errors: {
          password: 'Must contain uppercase, lowercase, number, and special character'
        }
      });
    }

    // Check if user exists
    const existingUser = await User.findOne({
      $or: [
        { email: email.toLowerCase() },
        { username: username.toLowerCase() }
      ]
    });

    if (existingUser) {
      return res.status(400).json({
        code: 'REGISTER_ERROR',
        message: 'User already exists',
        errors: {
          email: existingUser.email === email.toLowerCase() ? 'Email already registered' : undefined,
          username: existingUser.username === username.toLowerCase() ? 'Username already taken' : undefined
        }
      });
    }

    const user = new User({
      email: email.toLowerCase(),
      username,
      password,
      firstName: username
    });

    await user.save();

    const token = jwt.sign(
      { sub: user._id, email: user.email, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRATION }
    );

    const refreshToken = jwt.sign(
      { sub: user._id, type: 'refresh' },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: process.env.REFRESH_TOKEN_EXPIRATION }
    );

    res.status(201).json({
      token,
      refreshToken,
      user: {
        id: user._id,
        email: user.email,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        avatar: user.avatar
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Refresh Token
router.post('/refresh', async (req, res) => {
  try {
    const { refreshToken } = req.body;
    
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    
    const user = await User.findById(decoded.sub);
    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    const newToken = jwt.sign(
      { sub: user._id, email: user.email, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRATION }
    );

    res.json({
      token: newToken,
      refreshToken: refreshToken // Can issue new refresh token too
    });
  } catch (error) {
    res.status(401).json({
      code: 'TOKEN_EXPIRED',
      message: 'Invalid or expired refresh token'
    });
  }
});

// Get Profile (Protected)
router.get('/profile', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      id: user._id,
      email: user.email,
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName,
      avatar: user.avatar,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Auth Middleware
const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.sub;
    next();
  } catch (error) {
    res.status(401).json({
      code: 'TOKEN_EXPIRED',
      message: 'Token has expired'
    });
  }
};

module.exports = router;
```

---

## 📦 Python + FastAPI + SQLAlchemy

```python
# requirements.txt
fastapi==0.104.1
uvicorn==0.24.0
sqlalchemy==2.0.23
pydantic==2.5.0
python-jose==3.3.0
passlib==1.7.4
python-multipart==0.0.6
pymongo==4.6.0

# main.py
from fastapi import FastAPI, HTTPException, Depends, status
from pydantic import BaseModel, EmailStr
from sqlalchemy import create_engine, Column, String, DateTime
from sqlalchemy.orm import declarative_base, sessionmaker, Session
from datetime import datetime, timedelta
from jose import JWTError, jwt
from passlib.context import CryptContext
import os
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./streambox.db")
JWT_SECRET = os.getenv("JWT_SECRET", "your-secret-key")
JWT_REFRESH_SECRET = os.getenv("JWT_REFRESH_SECRET", "your-refresh-secret")

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(bind=engine)
Base = declarative_base()
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

app = FastAPI()

# Models
class User(Base):
    __tablename__ = "users"
    
    id = Column(String, primary_key=True)
    email = Column(String, unique=True, index=True)
    username = Column(String, unique=True, index=True)
    password = Column(String)
    first_name = Column(String)
    last_name = Column(String)
    avatar = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow)

# Schemas
class LoginRequest(BaseModel):
    email: EmailStr
    password: str

class RegisterRequest(BaseModel):
    username: str
    email: EmailStr
    password: str

class RefreshRequest(BaseModel):
    refreshToken: str

class UserResponse(BaseModel):
    id: str
    email: str
    username: str
    firstName: str
    lastName: str
    avatar: str | None

class AuthResponse(BaseModel):
    token: str
    refreshToken: str
    user: UserResponse

# Routes
@app.post("/auth/login", response_model=AuthResponse)
async def login(req: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == req.email.lower()).first()
    
    if not user or not pwd_context.verify(req.password, user.password):
        raise HTTPException(
            status_code=401,
            detail={
                "code": "LOGIN_ERROR",
                "message": "Invalid email or password"
            }
        )
    
    token = create_token(user.id, "access")
    refresh_token = create_token(user.id, "refresh")
    
    return {
        "token": token,
        "refreshToken": refresh_token,
        "user": UserResponse(
            id=user.id,
            email=user.email,
            username=user.username,
            firstName=user.first_name,
            lastName=user.last_name,
            avatar=user.avatar
        )
    }

# Helper function to create tokens
def create_token(user_id: str, token_type: str) -> str:
    if token_type == "access":
        expires_in = timedelta(hours=1)
        secret = JWT_SECRET
    else:
        expires_in = timedelta(days=7)
        secret = JWT_REFRESH_SECRET
    
    payload = {
        "sub": user_id,
        "type": token_type,
        "exp": datetime.utcnow() + expires_in,
        "iat": datetime.utcnow()
    }
    
    return jwt.encode(payload, secret, algorithm="HS256")

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
```

---

## 🧪 Testing with cURL

```bash
# Test Login
curl -X POST http://localhost:8000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "Password123!"
  }'

# Test Register
curl -X POST http://localhost:8000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "johndoe",
    "email": "john@example.com",
    "password": "Password123!"
  }'

# Test Refresh Token
curl -X POST http://localhost:8000/auth/refresh \
  -H "Content-Type: application/json" \
  -d '{
    "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
  }'

# Test Protected Endpoint
curl -X GET http://localhost:8000/auth/profile \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIs..."
```

---

## ✅ Checklist

- [ ] Install required dependencies
- [ ] Create database schema
- [ ] Implement all endpoints
- [ ] Test with cURL
- [ ] Set up environment variables
- [ ] Enable CORS for your frontend domain
- [ ] Hash passwords with bcrypt (minimum 10 rounds)
- [ ] Implement token expiration
- [ ] Set up token refresh mechanism
- [ ] Add rate limiting for auth endpoints
- [ ] Log authentication events
- [ ] Implement HTTPS in production

---

## 🔒 Security Checklist

- [ ] Use HTTPS only in production
- [ ] Hash passwords with bcrypt (min 10 rounds)
- [ ] Implement rate limiting on auth endpoints
- [ ] Validate all inputs server-side
- [ ] Use environment variables for secrets
- [ ] Implement token expiration
- [ ] Refresh tokens should expire after 7-30 days
- [ ] Access tokens should expire after 15-60 minutes
- [ ] Never log passwords or tokens
- [ ] Implement CORS correctly
- [ ] Use secure HTTP headers (HSTS, CSP, etc.)
- [ ] Implement account lockout after failed attempts

---

**Last Updated:** November 2024

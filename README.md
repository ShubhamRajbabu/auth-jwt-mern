# Auth JWT MERN - Complete Documentation

## 📋 Table of Contents
1. [Project Overview](#project-overview)
2. [Project Structure](#project-structure)
3. [Installation & Setup](#installation--setup)
4. [Dependencies Explained](#dependencies-explained)
5. [Architecture & Flow](#architecture--flow)
6. [File-by-File Explanation](#file-by-file-explanation)
7. [Authentication Flow](#authentication-flow)
8. [How Everything Works Together](#how-everything-works-together)
9. [Environment Variables](#environment-variables)

---

## 🎯 Project Overview

This is a **MERN Stack Authentication System** using **JWT (JSON Web Tokens)**. The project implements a complete authentication mechanism with:
- User registration
- User login
- JWT-based token management (Access & Refresh tokens)
- User logout
- Secure password hashing
- Cookie-based token storage

**Why JWT?** JWT provides a stateless authentication mechanism where the server doesn't need to store user sessions. Tokens are signed and can be verified without database lookups every time.

---

## 📁 Project Structure

```
auth-jwt-mern/
├── package.json              # Project configuration and dependencies
├── server.js                 # Entry point - starts the Express server
├── src/
│   ├── app.js                # Express app configuration and middleware setup
│   ├── config/
│   │   ├── db/
│   │   │   └── db.js         # MongoDB connection configuration
│   │   └── env/
│   │       └── env.js        # Environment variables loader
│   ├── controllers/
│   │   └── auth.controller.js # Business logic for authentication
│   ├── models/
│   │   ├── user.model.js     # User data schema
│   │   └── tokens.model.js   # Refresh token storage schema
│   └── routes/
│       └── auth.routes.js    # API endpoints definition
└── .env                      # Environment variables (not included, needs to be created)
```

---

## 🚀 Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or Atlas cloud)
- npm or yarn package manager

### Steps

1. **Clone or navigate to the project**
```bash
cd /Users/shubhamshubham/Desktop/auth-jwt-mern
```

2. **Install dependencies**
```bash
npm install
```

3. **Create `.env` file in the root directory** (required!)
```bash
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://localhost:27017/auth-jwt-mern
# OR for MongoDB Atlas: mongodb+srv://username:password@cluster.mongodb.net/dbname

JWT_SECRET_ACCESS_TOKEN=your_super_secret_access_key
JWT_SECRET_REFRESH_TOKEN=your_super_secret_refresh_key
JWT_ACCESS_TOKEN_EXPIRES_IN=15m
JWT_REFRESH_TOKEN_EXPIRES_IN=7d
```

4. **Start the server**
```bash
npm run dev    # Development mode (with nodemon auto-reload)
# OR
npm start      # Production mode
```

The server will start at `http://localhost:5000`

---

## 📦 Dependencies Explained

Each package in `package.json` serves a specific purpose:

| Package | Version | Purpose |
|---------|---------|---------|
| **express** | ^5.2.1 | Web framework for creating REST API endpoints |
| **mongoose** | ^9.2.1 | MongoDB object modeling tool for database operations |
| **jsonwebtoken** | ^9.0.3 | Creates and verifies JWT tokens for authentication |
| **bcryptjs** | ^3.0.3 | Hashes passwords securely (never store plain passwords!) |
| **cookie-parser** | ^1.4.7 | Parses HTTP cookies from requests |
| **cors** | ^2.8.6 | Enables Cross-Origin Resource Sharing (allows frontend to call backend) |
| **dotenv** | ^17.3.1 | Loads environment variables from `.env` file |
| **nodemon** | ^3.1.11 | Auto-restarts server during development when files change |

**Why `"type": "module"`?** This enables ES6 import/export syntax (`import/export`) instead of older CommonJS (`require/module.exports`).

---

## 🏗️ Architecture & Flow

### Three-Tier Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    API Routes Layer                          │
│              (auth.routes.js)                               │
│  POST /api/auth/register, /login, /refresh, /logout        │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                 Controller Layer                             │
│          (auth.controller.js)                               │
│  Handles business logic: validation, hashing, token gen    │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                   Data Model Layer                           │
│          (user.model.js, tokens.model.js)                   │
│       Communicates with MongoDB database                     │
└─────────────────────────────────────────────────────────────┘
```

---

## 📄 File-by-File Explanation

### 1. **`server.js`** - Application Entry Point

```javascript
import app from './src/app.js';
import connectDb from './src/config/db/db.js';
import { PORT } from './src/config/env/env.js';

app.listen(PORT, async () => {
    await connectDb()                    // Connect to MongoDB before starting server
    console.log(`Server is running on http://localhost:${PORT}`);
})
```

**What happens:**
- Imports the Express app configuration
- Imports database connection function
- Imports PORT from environment variables
- Starts the server on the specified port
- Connects to MongoDB database
- Logs server startup message

**Why?** This is the entry point. When you run `npm start`, this file executes first.

---

### 2. **`src/app.js`** - Express Configuration

```javascript
import express from 'express';
import cors from 'cors';
import authRouter from './routes/auth.routes.js';
import cookieParser from 'cookie-parser';

const app = express();

// Middleware Setup (executed in order for every request)
app.use(express.json());                    // Parse incoming JSON data
app.use(express.urlencoded({ extended: false }));  // Parse form data
app.use(cookieParser());                    // Parse cookies from requests
app.use(cors());                            // Allow cross-origin requests

// Route Setup
app.use('/api/auth', authRouter);           // All auth routes under /api/auth prefix

export default app;
```

**What happens:**
- Creates an Express application instance
- Sets up middleware (functions that process every request)
  - `express.json()`: Converts JSON request body to JavaScript object
  - `cookieParser()`: Makes cookies accessible via `req.cookies`
  - `cors()`: Allows frontend (different domain) to access this backend
- Registers authentication routes under `/api/auth` prefix

**Why middleware?** Middleware is like a filter. Every request passes through these in order before reaching the route handler.

---

### 3. **`src/config/env/env.js`** - Environment Configuration

```javascript
import { configDotenv } from "dotenv";

configDotenv();      // Loads variables from .env file into process.env

// Retrieve environment variables (with defaults for development)
const PORT = process.env.PORT;
const NODE_ENV = process.env.NODE_ENV || 'development';
const MONGO_URI = process.env.MONGO_URI;
const JWT_SECRET_ACCESS_TOKEN = process.env.JWT_SECRET_ACCESS_TOKEN;
const JWT_SECRET_REFRESH_TOKEN = process.env.JWT_SECRET_REFRESH_TOKEN;
const JWT_ACCESS_TOKEN_EXPIRES_IN = process.env.JWT_ACCESS_TOKEN_EXPIRES_IN;
const JWT_REFRESH_TOKEN_EXPIRES_IN = process.env.JWT_REFRESH_TOKEN_EXPIRES_IN;

export { PORT, NODE_ENV, MONGO_URI, JWT_SECRET_ACCESS_TOKEN, JWT_SECRET_REFRESH_TOKEN, JWT_ACCESS_TOKEN_EXPIRES_IN, JWT_REFRESH_TOKEN_EXPIRES_IN };
```

**What happens:**
- Loads `.env` file (contains sensitive data like database URL, secrets)
- Extracts all required configuration values
- Exports them for use throughout the app

**Why?** Never hardcode secrets in code! Using `.env` keeps sensitive data safe and makes configuration environment-specific (dev, staging, production).

---

### 4. **`src/config/db/db.js`** - Database Connection

```javascript
import mongoose from 'mongoose';
import { MONGO_URI } from '../env/env.js';

const connectDb = async () => {
    try {
        // Attempt to connect to MongoDB
        await mongoose.connect(MONGO_URI);
        console.log("Mongo db connected succesfully");
    } catch (error) {
        // If connection fails, log error and exit
        console.error("Error connecting to MongoDB:", error);
        process.exit(1);  // Exit process with error code 1
    }
};

export default connectDb;
```

**What happens:**
- Uses Mongoose to connect to MongoDB at the URI specified in `.env`
- If successful: logs success message
- If fails: logs error and stops the server

**Why?** Without database connection, the app can't store or retrieve user data. This function ensures the connection is established before any operations.

---

### 5. **`src/models/user.model.js`** - User Schema

```javascript
import mongoose from "mongoose";

// Define the structure of user documents in MongoDB
const userSchema = new mongoose.Schema({
    username: {
        type: String,           // Data type: text
        required: true,         // Must be provided when creating user
        trim: true              // Remove leading/trailing whitespace
    },
    email: {
        type: String,
        required: true,
        unique: true,           // No two users can have same email (prevents duplicates)
        trim: true
    },
    password: {
        type: String,
        required: true,
        minlength: 6            // Password must be at least 6 characters
    }
},
{
    timestamps: true            // Automatically add createdAt and updatedAt fields
});

// Create and export the User model
const User = mongoose.model("User", userSchema);
export default User;
```

**What happens:**
- Defines the structure/schema for user documents
- Specifies field types, validations, and constraints
- Creates a User model that can perform database operations

**Schema fields explained:**
- `username`: User's display name
- `email`: Unique identifier for login and communication
- `password`: Encrypted password (never store plain text!)
- `timestamps`: MongoDB automatically tracks when records are created/updated

---

### 6. **`src/models/tokens.model.js`** - Refresh Token Schema

```javascript
import mongoose from "mongoose";

const tokenSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,    // Reference to User document
        ref: "User",                              // Points to User model
        required: true
    },
    token: {
        type: String,
        required: true,
        unique: true                              // Each token is unique
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: '1d'                             // Auto-delete after 1 day
    }
}, {
    timestamps: true
})

const Token = mongoose.model("Token", tokenSchema);
export default Token;
```

**What happens:**
- Defines structure for storing refresh tokens
- Links tokens to specific users via `userId`
- Automatically removes old tokens after 1 day (TTL - Time To Live)

**Why separate token storage?**
- Refresh tokens are long-lived (e.g., 7 days)
- Storing in database allows server to invalidate tokens (for logout)
- Access tokens are short-lived (e.g., 15 minutes) and only verified via signature

---

### 7. **`src/routes/auth.routes.js`** - API Endpoints

```javascript
import express from 'express';
import { loginController, logoutController, refreshAccessToken, registerController } from '../controllers/auth.controller.js';

const authRouter = express.Router();

// Define routes and link to controller functions
authRouter.post('/register', registerController);
authRouter.post('/login', loginController);
authRouter.post('/refresh', refreshAccessToken);
authRouter.post('/logout', logoutController)

export default authRouter;
```

**What happens:**
- Creates a router object for authentication endpoints
- Maps HTTP POST requests to controller functions
- These become accessible at `/api/auth/register`, `/api/auth/login`, etc.

**Routes:**
- `POST /api/auth/register` - Create new user account
- `POST /api/auth/login` - Authenticate and get tokens
- `POST /api/auth/refresh` - Get new access token using refresh token
- `POST /api/auth/logout` - Invalidate refresh token

---

### 8. **`src/controllers/auth.controller.js`** - Business Logic

This is the most important file. Let's break it down function by function:

#### **`registerController`** - User Registration

```javascript
const registerController = async (req, res) => {
    try {
        // Extract data from request body
        const { username, email, password } = req.body;

        // Validation: Check if all fields are provided
        if (!username || !email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        // Check if user with this email already exists
        const isUserExist = await User.findOne({ email });
        if (isUserExist) {
            return res.status(400).json({ message: "User already exists" });
        }

        // Hash password using bcrypt (salting rounds: 10)
        // NEVER store plain passwords! Hashing makes it impossible to reverse
        const hashPassword = await bcrypt.hash(password, 10);

        // Create new user in database
        const newUser = await User.create({
            username, email, password: hashPassword
        })
        if (!newUser) {
            return res.status(500).json({ message: "User registration failed" });
        }

        // Generate access token (short-lived, 15 minutes)
        const accessToken = jwt.sign(
            { id: newUser._id },                    // Payload: user ID
            JWT_SECRET_ACCESS_TOKEN,                 // Secret for signing
            { expiresIn: JWT_ACCESS_TOKEN_EXPIRES_IN } // Expiration time
        )
        
        // Store access token in HTTP-only cookie (secure, not accessible via JS)
        res.cookie("accessToken", accessToken, {
            httpOnly: true,              // Prevents JavaScript from accessing it
            secure: NODE_ENV === 'production',  // HTTPS only in production
            sameSite: 'strict'           // Prevents CSRF attacks
        });

        // Generate refresh token (long-lived, 7 days)
        const refreshToken = jwt.sign(
            { id: newUser._id },
            JWT_SECRET_REFRESH_TOKEN,
            { expiresIn: JWT_REFRESH_TOKEN_EXPIRES_IN }
        )
        
        // Store refresh token in database (allows server to invalidate it)
        const storeRefreshTokenIndb = await Token.create({
            userId: newUser._id,
            token: refreshToken
        });

        if (!storeRefreshTokenIndb) {
            return res.status(500).json({ message: "Failed to store refresh token" });
        }

        // Store refresh token in HTTP-only cookie as well
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: NODE_ENV === 'production',
            sameSite: 'strict'
        });

        // Send success response with user data (excluding password)
        res.status(201).json({
            message: "User registered successfully",
            user: {
                _id: newUser._id,
                username: newUser.username,
                email: newUser.email
            }
        });
    } catch (error) {
        console.error("Registration error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}
```

**Step-by-step flow:**
1. Receive username, email, password from request
2. Validate that all fields are provided
3. Check if user with that email already exists
4. Hash the password (bcrypt makes it cryptographically secure)
5. Create user in MongoDB
6. Generate short-lived access token (15 minutes)
7. Set access token cookie (httpOnly prevents JavaScript access)
8. Generate long-lived refresh token (7 days)
9. Store refresh token in MongoDB (so it can be revoked)
10. Set refresh token cookie
11. Return success response with user data

---

#### **`loginController`** - User Login

```javascript
const loginController = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validate input
        if (!email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        // Find user by email
        const isUserExist = await User.findOne({ email });
        if (!isUserExist) {
            return res.status(400).json({ message: "Invalid User credentials" });
        }

        // Compare provided password with hashed password in database
        const isPasswordValid = await bcrypt.compare(password, isUserExist.password);

        if (!isPasswordValid) {
            return res.status(400).json({ message: "Invalid User credentials" });
        }

        // Password is correct, generate tokens (same as registration)
        const accessToken = jwt.sign(
            { id: isUserExist._id },
            JWT_SECRET_ACCESS_TOKEN,
            { expiresIn: JWT_ACCESS_TOKEN_EXPIRES_IN }
        )
        res.cookie("accessToken", accessToken, {
            httpOnly: true,
            secure: NODE_ENV === 'production',
            sameSite: 'strict'
        });

        const refreshToken = jwt.sign(
            { id: isUserExist._id },
            JWT_SECRET_REFRESH_TOKEN,
            { expiresIn: JWT_REFRESH_TOKEN_EXPIRES_IN }
        )
        
        // Store new refresh token in database
        const storeRefreshTokenIndb = await Token.create({
            userId: isUserExist._id,
            token: refreshToken
        });
        
        if (!storeRefreshTokenIndb) {
            return res.status(500).json({ message: "Failed to store refresh token" });
        }

        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: NODE_ENV === 'production',
            sameSite: 'strict'
        });

        // Return user data and success message
        res.status(200).json({
            message: "User logged in successfully",
            user: {
                _id: isUserExist._id,
                username: isUserExist.username,
                email: isUserExist.email
            }
        });
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}
```

**Key difference from registration:**
- Instead of creating user, it finds existing user
- Uses `bcrypt.compare()` to verify password (bcrypt can't reverse hashes, so it hashes the input and compares)
- Still generates and stores tokens

---

#### **`refreshAccessToken`** - Refresh Token Logic

```javascript
const refreshAccessToken = async (req, res) => {
    // Get refresh token from cookies
    const { refreshToken } = req.cookies;
    if (!refreshToken) {
        return res.status(401).json({ message: "Refresh token is required" });
    }

    try {
        // Verify refresh token signature using secret
        const isRefreshTokenValid = jwt.verify(refreshToken, JWT_SECRET_REFRESH_TOKEN);

        // Check if refresh token exists in database (hasn't been revoked/logged out)
        const refreshTokenInDb = await Token.findOne({ token: refreshToken });
        if (!refreshTokenInDb) {
            return res.status(401).json({ message: "Refresh token not found" });
        }

        // Generate new access token using user ID from refresh token
        const newAccessToken = jwt.sign(
            { id: isRefreshTokenValid.id },
            JWT_SECRET_ACCESS_TOKEN,
            { expiresIn: JWT_ACCESS_TOKEN_EXPIRES_IN }
        );
        
        // Set new access token cookie
        res.cookie("accessToken", newAccessToken, {
            httpOnly: true,
            secure: NODE_ENV === 'production',
            sameSite: 'strict'
        });

        res.status(200).json({ message: "Access token refreshed successfully" });

    } catch (error) {
        console.error("Refresh token error:", error);
        res.status(401).json({ message: "Refresh token is invalid or expired" });
    }
}
```

**Why refresh tokens?**
- Access tokens expire quickly (15 min) for security
- If stolen, window of compromise is only 15 minutes
- Refresh tokens have longer expiry (7 days) but are rarely used
- When access token expires, use refresh token to get new one without re-entering password

**Flow:**
1. User's access token expires
2. Frontend uses refresh token to request new access token
3. Server validates refresh token hasn't been revoked
4. Server issues new access token
5. Refresh token stays valid for longer

---

#### **`logoutController`** - User Logout

```javascript
const logoutController = async (req, res) => {
    // Get refresh token from cookies
    const { refreshToken } = req.cookies;
    
    // If refresh token exists, delete it from database (revoke it)
    if (refreshToken) {
        await Token.deleteOne({ token: refreshToken });
    }

    // Clear both cookies from client
    res.clearCookie("accessToken", {
        httpOnly: true,
        secure: NODE_ENV === 'production',
        sameSite: 'strict'
    });
    res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: NODE_ENV === 'production',
        sameSite: 'strict'
    });

    res.status(200).json({ message: "User logged out successfully" });
}
```

**What happens:**
1. Gets refresh token from cookie
2. Deletes it from database (so it can't be used to refresh anymore)
3. Clears both cookies from client browser
4. User is now logged out

**Why delete from database?** If someone steals the refresh token, we want to prevent them from using it. By deleting it, even if they try to refresh, the token won't exist in DB.

---

## 🔐 Authentication Flow

### Registration Flow
```
┌─────────────────────────┐
│  User submits:          │
│  - username             │
│  - email                │
│  - password             │
└────────────┬────────────┘
             │
             ▼
┌─────────────────────────────────────────┐
│  Register Controller                    │
│  1. Validate inputs                     │
│  2. Check if email exists               │
│  3. Hash password with bcrypt           │
│  4. Create user in MongoDB              │
└────────────┬────────────────────────────┘
             │
             ▼
┌─────────────────────────────────────────┐
│  Generate Tokens                        │
│  - Access Token (15 min)                │
│  - Refresh Token (7 days)               │
└────────────┬────────────────────────────┘
             │
             ▼
┌─────────────────────────────────────────┐
│  Store & Send                           │
│  - Set cookies (httpOnly)               │
│  - Store refresh token in DB            │
│  - Return user data                     │
└─────────────────────────────────────────┘
```

### Login Flow
```
┌──────────────────────┐
│  User submits:       │
│  - email             │
│  - password          │
└────────────┬─────────┘
             │
             ▼
┌──────────────────────────────────────────┐
│  Login Controller                        │
│  1. Find user by email                   │
│  2. Verify password using bcrypt.compare │
│  3. If valid, generate tokens            │
└────────────┬─────────────────────────────┘
             │
             ▼
┌──────────────────────────────────────────┐
│  Return Tokens                           │
│  - Set cookies                           │
│  - Store refresh token in DB             │
│  - Return success response               │
└──────────────────────────────────────────┘
```

### Token Refresh Flow
```
┌────────────────────────────┐
│  Access Token expires      │
│  Frontend uses Refresh Tok  │
└────────────┬───────────────┘
             │
             ▼
┌──────────────────────────────────────────┐
│  Refresh Access Token Controller         │
│  1. Get refresh token from cookie        │
│  2. Verify token signature               │
│  3. Check if token exists in DB          │
│  4. Generate new access token            │
└────────────┬─────────────────────────────┘
             │
             ▼
┌──────────────────────────────────────────┐
│  Set new access token cookie             │
│  User continues using app                │
└──────────────────────────────────────────┘
```

### Logout Flow
```
┌──────────────────────┐
│  User clicks logout  │
└────────────┬─────────┘
             │
             ▼
┌────────────────────────────────────────┐
│  Logout Controller                     │
│  1. Delete refresh token from DB       │
│  2. Clear cookies                      │
└────────────┬───────────────────────────┘
             │
             ▼
┌────────────────────────────────────────┐
│  User logged out                       │
│  Tokens are invalid                    │
└────────────────────────────────────────┘
```

---

## 🔄 How Everything Works Together

### Complete Request Lifecycle: User Registration

```
Frontend sends POST request to /api/auth/register
│
├─ app.js middleware processes:
│  ├─ express.json() → Parses JSON body
│  ├─ cookieParser() → Extracts cookies
│  └─ cors() → Allows cross-origin
│
├─ Routes matcher finds POST /api/auth/register
│  └─ Directs to authRouter
│
├─ authRouter matches /register
│  └─ Calls registerController function
│
├─ registerController executes:
│  ├─ Validates input from req.body
│  ├─ User.findOne() queries MongoDB
│  ├─ bcrypt.hash() securely hashes password
│  ├─ User.create() inserts new user in DB
│  ├─ jwt.sign() creates access token
│  ├─ res.cookie() sets access token cookie
│  ├─ jwt.sign() creates refresh token
│  ├─ Token.create() stores refresh token in DB
│  ├─ res.cookie() sets refresh token cookie
│  └─ res.status(201).json() sends response
│
└─ Frontend receives:
   ├─ Cookies in response headers
   ├─ User data in JSON body
   └─ Success message
```

### Data Flow During Login

```
Client Request: POST /api/auth/login
│
├─ JSON Body: { email: "user@example.com", password: "mypass123" }
│
├─ Server Processing:
│  ├─ Find user: User.findOne({ email })
│  ├─ Compare: bcrypt.compare("mypass123", hashedPassword)
│  │           Returns: true or false
│  ├─ If true:
│  │  ├─ Generate: jwt.sign() → "access_token_string"
│  │  ├─ Generate: jwt.sign() → "refresh_token_string"
│  │  ├─ Store: Token.create({ userId, token })
│  │  └─ Set cookies in response
│  │
│  └─ If false:
│     └─ Return: 400 "Invalid credentials"
│
└─ Response to Client:
   ├─ Status: 200 OK
   ├─ Cookies: accessToken, refreshToken
   └─ JSON: { message, user: { _id, username, email } }
```

### What Happens When Access Token Expires

```
Frontend stores: accessToken (expires in 15 min)

After 15 minutes:
├─ User makes API call with expired accessToken
├─ Backend rejects: "Token expired"
│
├─ Frontend calls: POST /api/auth/refresh
│  ├─ Sends refreshToken cookie
│  │
│  ├─ Server:
│  │  ├─ Gets refresh token from req.cookies
│  │  ├─ Verifies: jwt.verify(token, secret)
│  │  ├─ Checks: Token.findOne({ token })
│  │  ├─ Generates new: jwt.sign() → new accessToken
│  │  └─ Sets new cookie
│  │
│  └─ Returns: 200 "Token refreshed"
│
├─ Frontend gets new accessToken
│
└─ Frontend retries original request with new token
```

---

## 🔑 Environment Variables

Create a `.env` file in the root directory with these variables:

```bash
# Server Configuration
PORT=5000                                    # Port where server runs
NODE_ENV=development                         # Environment type (development/production)

# Database Configuration
MONGO_URI=mongodb://localhost:27017/auth-jwt-mern
# For MongoDB Atlas (cloud):
# MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/database-name

# JWT Secrets (use strong random strings in production)
JWT_SECRET_ACCESS_TOKEN=your_super_secret_access_token_key_min_32_chars
JWT_SECRET_REFRESH_TOKEN=your_super_secret_refresh_token_key_min_32_chars

# Token Expiration Times
JWT_ACCESS_TOKEN_EXPIRES_IN=15m              # Short expiry for security
JWT_REFRESH_TOKEN_EXPIRES_IN=7d              # Longer expiry for convenience
```

**Important:**
- `JWT_SECRET_*` must be long, random strings (minimum 32 characters)
- Different secrets for access and refresh tokens
- Never commit `.env` file to version control
- In production, use strong, unique secrets

---

## 📌 Key Concepts Explained

### What is JWT?
- **JWT** = JSON Web Token
- Three parts separated by dots: `header.payload.signature`
- Example: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEyMzQ1In0.signature`
- Server signs it with secret; only server can verify it

### Why Two Tokens?
- **Access Token**: Short-lived (15 min), used for API calls
- **Refresh Token**: Long-lived (7 days), only used to refresh access token
- If access token is stolen, damage is limited to 15 minutes
- Refresh token is stored in database, can be revoked

### Why Hash Passwords?
- Never store plain text passwords
- Hashing is one-way (can't reverse it)
- If database is stolen, passwords are still safe
- bcrypt uses salting and slow hashing to prevent rainbow table attacks

### What are Cookies?
- Small data stored in browser
- Automatically sent with every request to that domain
- `httpOnly`: JavaScript can't access (prevents XSS attacks)
- `secure`: Only sent over HTTPS (prevents man-in-the-middle)
- `sameSite`: Prevents CSRF attacks

---

## 🧪 Testing the API

### 1. Register a User
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "john",
    "email": "john@example.com",
    "password": "password123"
  }'
```

Expected Response:
```json
{
  "message": "User registered successfully",
  "user": {
    "_id": "65abc123def456",
    "username": "john",
    "email": "john@example.com"
  }
}
```

### 2. Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

### 3. Refresh Access Token
```bash
curl -X POST http://localhost:5000/api/auth/refresh \
  -H "Cookie: refreshToken=<your_refresh_token>"
```

### 4. Logout
```bash
curl -X POST http://localhost:5000/api/auth/logout \
  -H "Cookie: refreshToken=<your_refresh_token>"
```

---

## 📊 Data Models Summary

### User Model
```
{
  _id: ObjectId,           // Unique identifier (auto-generated by MongoDB)
  username: String,        // User's display name
  email: String,           // Unique email address
  password: String,        // Hashed password
  createdAt: Date,         // Auto-generated timestamp
  updatedAt: Date          // Auto-generated timestamp
}
```

### Token Model
```
{
  _id: ObjectId,           // Unique identifier
  userId: ObjectId,        // Reference to User._id
  token: String,           // The actual refresh token
  createdAt: Date,         // Auto-generated, expires after 1 day
  updatedAt: Date          // Auto-generated timestamp
}
```

---

## 🐛 Common Issues & Solutions

### Issue: "Cannot find module"
**Solution:** Run `npm install` to install dependencies

### Issue: "MongoDB connection refused"
**Solution:** Ensure MongoDB is running. For local MongoDB: `mongod`. For Atlas: check MONGO_URI in `.env`

### Issue: "Cookies not set"
**Solution:** Ensure frontend is sending requests with `credentials: 'include'` in fetch/axios

### Issue: "Token is not valid"
**Solution:** Check that JWT_SECRET_* matches between token generation and verification. Also check token hasn't expired.

---

## 🚀 Next Steps to Extend This Project

1. **Add Authorization Middleware**: Create middleware to verify access token on protected routes
2. **Add Role-Based Access Control**: Different user types (admin, user, etc.)
3. **Add Password Reset**: Send reset link via email
4. **Add Two-Factor Authentication**: SMS or authenticator app
5. **Add Rate Limiting**: Prevent brute force attacks
6. **Add Email Verification**: Verify email before account activation
7. **Add Refresh Token Rotation**: Issue new refresh token on each refresh
8. **Add CORS Configuration**: Specify allowed origins instead of allowing all

---


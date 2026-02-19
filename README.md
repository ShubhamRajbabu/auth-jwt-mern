# Auth JWT MERN - Complete Documentation

A secure JWT-based authentication backend built with Node.js, Express, and MongoDB. Implements dual-token authentication (Access & Refresh tokens), bcrypt password hashing, and HTTP-only cookie storage with a clean layered architecture.

## 📋 Table of Contents
1. [Project Overview](#project-overview)
2. [Project Structure](#project-structure)
3. [Installation & Setup](#installation--setup)
4. [API Endpoints](#api-endpoints)
5. [Dependencies Explained](#dependencies-explained)
6. [Architecture & Flow](#architecture--flow)
7. [Component Details](#component-details)
8. [Authentication Flow](#authentication-flow)
9. [Environment Variables](#environment-variables)
10. [Error Handling](#error-handling)

---

## 🎯 Project Overview

This is a **production-ready MERN Stack Authentication System** using **JWT (JSON Web Tokens)**. It implements a complete, secure authentication mechanism with:

- ✅ **User Registration** - Secure signup with bcrypt password hashing
- ✅ **User Login** - Credential validation and dual-token issuance
- ✅ **JWT Token Management** - Access tokens (15m) & Refresh tokens (7d)
- ✅ **Token Refresh** - Seamless access token renewal without re-login
- ✅ **User Logout** - Token invalidation and cleanup
- ✅ **Protected Routes** - JWT-based route protection with middleware
- ✅ **HTTP-Only Cookies** - Secure token storage (XSS/CSRF protection)
- ✅ **Layered Architecture** - Clean separation of concerns (Routes → Controllers → Services → Repositories → Models)

**Why JWT?** JWT provides stateless authentication. The server doesn't store sessions—it cryptographically signs tokens that clients include with requests. This enables:
- Horizontal scalability (no session replication needed)
- Stateless APIs (easier microservices deployment)
- CORS-friendly authentication
- Token-based access delegation

---

## 📁 Project Structure

```
auth-jwt-mern/
├── package.json                    # Project dependencies & scripts
├── server.js                       # Application entry point
├── README.md                       # Project documentation
├── src/
│   ├── app.js                      # Express app setup & middleware configuration
│   ├── config/
│   │   ├── db/
│   │   │   └── db.js               # MongoDB connection setup
│   │   └── env/
│   │       └── env.js              # Environment variables loader (dotenv)
│   ├── controllers/
│   │   ├── auth.controller.js      # Request handlers for auth operations
│   │   └── user.controller.js      # Request handlers for user profile
│   ├── services/
│   │   ├── auth.services.js        # Auth business logic (register, login, logout)
│   │   └── token.service.js        # Token generation & refresh logic
│   ├── repositories/
│   │   ├── user.repository.js      # User CRUD operations
│   │   └── token.repository.js     # Refresh token CRUD operations
│   ├── models/
│   │   ├── user.model.js           # User schema (username, email, password)
│   │   └── tokens.model.js         # Token schema (userId, refreshToken)
│   ├── middlewares/
│   │   ├── auth.middleware.js      # JWT verification & validation
│   │   └── error.middleware.js     # Global error handling
│   ├── routes/
│   │   ├── auth.routes.js          # Auth endpoints (/register, /login, etc.)
│   │   └── user.routes.js          # User endpoints (/profile)
│   └── utils/
│       └── error.util.js           # Custom error creation utility
└── .env                            # Environment variables (create locally)
```

---

## 🚀 Installation & Setup

### Prerequisites
- **Node.js** v14+ (download from [nodejs.org](https://nodejs.org))
- **MongoDB** (local installation or [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) cloud)
- **npm** or **yarn** package manager

### Step-by-Step Setup

1. **Navigate to the project directory**
```bash
cd /Users/shubhamshubham/Desktop/auth-jwt-mern
```

2. **Install dependencies**
```bash
npm install
```

3. **Create `.env` file** in the root directory with required variables:
```bash
cat > .env << EOF
PORT=5000
NODE_ENV=development

# MongoDB Connection
MONGO_URI=mongodb://localhost:27017/auth-jwt-mern
# For MongoDB Atlas: mongodb+srv://username:password@cluster.mongodb.net/auth-jwt-mern

# JWT Secrets (use strong, random values in production)
JWT_SECRET_ACCESS_TOKEN=your_super_secret_access_token_key
JWT_SECRET_REFRESH_TOKEN=your_super_secret_refresh_token_key

# Token Expiry Times
JWT_ACCESS_TOKEN_EXPIRES_IN=15m
JWT_REFRESH_TOKEN_EXPIRES_IN=7d
EOF
```

4. **Start the server**
```bash
npm run dev      # Development mode (auto-restart with nodemon)
# or
npm start        # Production mode
```

5. **Verify the server is running**
```bash
# Should see: Server is running on http://localhost:5000
curl http://localhost:5000/api/auth/register
```

---

## 📡 API Endpoints

### Authentication Routes (`/api/auth`)

#### 1. **POST /api/auth/register** - Create new user account
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "john_doe",
    "email": "john@example.com",
    "password": "securePassword123"
  }'
```
**Response (201 Created):**
```json
{
  "message": "User registered successfully",
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "username": "john_doe",
    "email": "john@example.com"
  }
}
```
**Sets cookies:** `accessToken`, `refreshToken` (HTTP-only)

---

#### 2. **POST /api/auth/login** - Authenticate user
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "securePassword123"
  }'
```
**Response (200 OK):**
```json
{
  "message": "User login successfully",
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "username": "john_doe",
    "email": "john@example.com"
  }
}
```
**Sets cookies:** `accessToken`, `refreshToken` (HTTP-only)

---

#### 3. **POST /api/auth/refresh** - Get new access token
```bash
curl -X POST http://localhost:5000/api/auth/refresh \
  -H "Content-Type: application/json" \
  -b "refreshToken=<token_from_cookie>"
```
**Response (200 OK):**
```json
{
  "message": "Access token refreshed",
  "newAccessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```
**Sets cookie:** `accessToken` (HTTP-only)

---

#### 4. **POST /api/auth/logout** - Invalidate user session
```bash
curl -X POST http://localhost:5000/api/auth/logout \
  -b "refreshToken=<token_from_cookie>"
```
**Response (200 OK):**
```json
{
  "message": "User logout successfully"
}
```
**Clears cookies:** `accessToken`, `refreshToken`

---

### User Routes (`/api/user`)

#### 1. **GET /api/user/profile** - Get authenticated user profile
```bash
curl -X GET http://localhost:5000/api/user/profile \
  -b "accessToken=<token_from_cookie>"
```
**Response (200 OK):**
```json
{
  "message": "User profile",
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "username": "john_doe",
    "email": "john@example.com",
    "createdAt": "2026-02-19T10:30:00.000Z"
  }
}
```
**Requires:** Valid `accessToken` cookie (via auth.middleware)

---

## 📦 Dependencies Explained

| Package | Version | Purpose |
|---------|---------|---------|
| **express** | ^5.2.1 | Web framework for building REST APIs & routing |
| **mongoose** | ^9.2.1 | MongoDB object modeling (schemas, validation, queries) |
| **jsonwebtoken** | ^9.0.3 | JWT token creation and verification |
| **bcryptjs** | ^3.0.3 | Password hashing with salt (security) |
| **cookie-parser** | ^1.4.7 | Parse HTTP cookies from requests |
| **cors** | ^2.8.6 | Enable Cross-Origin Resource Sharing (frontend ↔ backend) |
| **dotenv** | ^17.3.1 | Load environment variables from `.env` file |
| **nodemon** | ^3.1.11 | Auto-restart server on file changes (dev only) |

### Why `"type": "module"` in package.json?
Enables ES6 `import/export` syntax instead of CommonJS `require/module.exports`. Modern and cleaner.

---

## 🏗️ Architecture & Flow

### Five-Tier Layered Architecture

```
┌────────────────────────────────────────────────────────────────────┐
│                    1️⃣  ROUTES LAYER                                │
│                  (auth.routes.js, user.routes.js)                  │
│  Defines API endpoints & HTTP methods                              │
│  POST /api/auth/register, /login, /refresh, /logout               │
│  GET  /api/user/profile                                            │
└────────────────────────────────────────────────────────────────────┘
                              ↓
┌────────────────────────────────────────────────────────────────────┐
│              2️⃣  MIDDLEWARE LAYER                                   │
│        (auth.middleware.js, error.middleware.js)                   │
│  Request processing: JWT validation, error handling                │
└────────────────────────────────────────────────────────────────────┘
                              ↓
┌────────────────────────────────────────────────────────────────────┐
│              3️⃣  CONTROLLER LAYER                                   │
│          (auth.controller.js, user.controller.js)                  │
│  Receives requests, validates input, delegates to services         │
│  Manages response formatting and error handling                    │
└────────────────────────────────────────────────────────────────────┘
                              ↓
┌────────────────────────────────────────────────────────────────────┐
│              4️⃣  SERVICE LAYER                                      │
│         (auth.services.js, token.service.js)                       │
│  Business logic: registration, login, token generation/refresh     │
│  Password hashing, credential validation, token management         │
└────────────────────────────────────────────────────────────────────┘
                              ↓
┌────────────────────────────────────────────────────────────────────┐
│              5️⃣  REPOSITORY LAYER                                   │
│         (user.repository.js, token.repository.js)                  │
│  Database operations: CRUD on Users & Tokens                       │
└────────────────────────────────────────────────────────────────────┘
                              ↓
┌────────────────────────────────────────────────────────────────────┐
│              6️⃣  DATA MODEL LAYER                                   │
│           (user.model.js, tokens.model.js)                         │
│  MongoDB Schemas: defines data structure & validation rules        │
└────────────────────────────────────────────────────────────────────┘
                              ↓
┌────────────────────────────────────────────────────────────────────┐
│              7️⃣  DATABASE LAYER                                     │
│  MongoDB: persistent data storage                                  │
└────────────────────────────────────────────────────────────────────┘
```

**Architecture Benefits:**
- ✅ **Separation of Concerns** - Each layer has single responsibility
- ✅ **Testability** - Layers can be tested independently
- ✅ **Maintainability** - Easy to locate and modify specific functionality
- ✅ **Reusability** - Services can be called by multiple controllers
- ✅ **Scalability** - Easy to add new features without affecting other layers

---

## 🔧 Component Details

### 1. **Entry Point: `server.js`**

```javascript
import app from './src/app.js';
import connectDb from './src/config/db/db.js';
import { PORT } from './src/config/env/env.js';

app.listen(PORT, async () => {
    await connectDb()
    console.log(`Server is running on http://localhost:${PORT}`);
})
```

**Purpose:** Starts the Express server and connects to MongoDB.

---

### 2. **App Configuration: `src/app.js`**

```javascript
import express from 'express';
import cors from 'cors';
import authRouter from './routes/auth.routes.js';
import cookieParser from 'cookie-parser';
import userRouter from './routes/user.routes.js';
import errorMiddleware from './middlewares/error.middleware.js';

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors());

// Routes
app.use('/api/auth', authRouter);
app.use('/api/user', userRouter);

// Error handling
app.use(errorMiddleware);
export default app;
```

**Purpose:** Configures Express middleware and registers routes.

---

### 3. **Environment Config: `src/config/env/env.js`**

Loads all environment variables from `.env` file using dotenv. Makes configuration centralized and secure.

---

### 4. **Database Connection: `src/config/db/db.js`**

Connects to MongoDB using Mongoose. Called at server startup in `server.js`.

---

### 5. **Data Models**

#### **User Model** (`src/models/user.model.js`)
```javascript
const userSchema = new mongoose.Schema({
    username: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, trim: true },
    password: { type: String, required: true, minlength: 6 }
}, { timestamps: true });
```

#### **Token Model** (`src/models/tokens.model.js`)
```javascript
const tokenSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    token: { type: String, required: true, unique: true },
    createdAt: { type: Date, default: Date.now, expires: '1d' }
}, { timestamps: true });
```

---

### 6. **Repositories (Database Layer)**

**`src/repositories/user.repository.js`**
- `createUser()` - Create new user
- `getUserByEmail()` - Find user by email

**`src/repositories/token.repository.js`**
- `createToken()` - Store refresh token
- `getTokenByUserId()` - Retrieve token
- `deleteTokenByUserId()` - Invalidate token (logout)

---

### 7. **Services (Business Logic Layer)**

#### **`src/services/auth.services.js`**
- `registerService()` - Validation → Hash password → Create user → Generate tokens
- `loginService()` - Find user → Validate password → Generate tokens
- `logoutService()` - Delete refresh token
- `refreshAccessTokenService()` - Validate refresh token → Issue new access token

#### **`src/services/token.service.js`**
- `generateTokens()` - Creates both access and refresh tokens using JWT

---

### 8. **Controllers (Request/Response Layer)**

#### **`src/controllers/auth.controller.js`**
- `registerController()` - Calls registerService, sets cookies, returns response
- `loginController()` - Calls loginService, sets cookies, returns response
- `refreshAccessTokenController()` - Calls refresh service, updates access token cookie
- `logoutController()` - Calls logout service, clears cookies

#### **`src/controllers/user.controller.js`**
- Returns authenticated user's profile information

---

### 9. **Middleware**

#### **`src/middlewares/auth.middleware.js`**
Verifies JWT from cookies and protects routes:
```javascript
const authMiddleware = (req, res, next) => {
    const { accessToken } = req.cookies;
    if (!accessToken) {
        return res.status(401).json({ message: "Invalid User" });
    }
    try {
        const decoded = jwt.verify(accessToken, JWT_SECRET_ACCESS_TOKEN);
        if (!decoded || !decoded.id) {
            return res.status(401).json({ message: "Invalid token" });
        }
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ message: "Token got expired" });
    }
}
```

#### **`src/middlewares/error.middleware.js`**
Centralized error handling for all routes.

---

### 10. **Routes**

#### **`src/routes/auth.routes.js`**
```javascript
authRouter.post('/register', registerController);
authRouter.post('/login', loginController);
authRouter.post('/refresh', refreshAccessTokenController);
authRouter.post('/logout', logoutController);
```

#### **`src/routes/user.routes.js`**
```javascript
userRouter.get('/profile', authMiddleware, userController);
```

---

## 🔐 Authentication Flow Diagram

### Complete Authentication Cycle

```
1. REGISTRATION
┌──────────────────────────────────────────────────────────────┐
│ User → POST /api/auth/register                              │
│ Body: { username, email, password }                         │
└──────────────────────────────────────────────────────────────┘
                         ↓
                  Controller validates
                  & calls Service
                         ↓
              Service hashes password
              & validates uniqueness
                         ↓
              User created in MongoDB
                         ↓
            Tokens generated (JWT)
                         ↓
         Refresh token stored in DB
                         ↓
          Tokens set in HTTP-only cookies
                         ↓
           Response: User data + 201 Created

2. LOGIN
┌──────────────────────────────────────────────────────────────┐
│ User → POST /api/auth/login                                 │
│ Body: { email, password }                                   │
└──────────────────────────────────────────────────────────────┘
                         ↓
              Find user, verify password
                  (bcrypt.compare)
                         ↓
         Delete any existing refresh tokens
                         ↓
              Generate new tokens
                         ↓
         Store new refresh token in DB
                         ↓
          Set tokens in HTTP-only cookies
                         ↓
           Response: User data + 200 OK

3. ACCESS PROTECTED ROUTE
┌──────────────────────────────────────────────────────────────┐
│ User → GET /api/user/profile                                │
│ Cookies: { accessToken, refreshToken }                      │
└──────────────────────────────────────────────────────────────┘
                         ↓
           Auth Middleware checks accessToken
                         ↓
         JWT verified using JWT_SECRET_ACCESS_TOKEN
                         ↓
    User ID extracted from token payload
                         ↓
        Route handler executes with req.user
                         ↓
           Response: User profile data

4. TOKEN REFRESH (when access token expires)
┌──────────────────────────────────────────────────────────────┐
│ Frontend detects 401 response                               │
│ → POST /api/auth/refresh                                    │
│ Cookies: { refreshToken }                                   │
└──────────────────────────────────────────────────────────────┘
                         ↓
      Verify refresh token signature
                         ↓
     Check if token exists in DB (not revoked)
                         ↓
          Generate new access token
                         ↓
        Set new accessToken in cookie
                         ↓
        Response: 200 OK (Frontend retries request)

5. LOGOUT
┌──────────────────────────────────────────────────────────────┐
│ User → POST /api/auth/logout                                │
│ Cookies: { refreshToken }                                   │
└──────────────────────────────────────────────────────────────┘
                         ↓
          Delete refresh token from DB
                         ↓
        Clear both cookies (client-side)
                         ↓
           Response: Logout success message
```

---

## 🛡️ Security Features

| Feature | Implementation | Benefit |
|---------|----------------|---------|
| **Password Hashing** | bcryptjs with salt (10 rounds) | Passwords are one-way encrypted; unrecoverable even if DB is breached |
| **HTTP-Only Cookies** | `httpOnly: true` on all token cookies | JavaScript cannot access tokens (prevents XSS attacks) |
| **Secure Flag** | `secure: true` in production | Cookies only sent over HTTPS (prevents man-in-the-middle attacks) |
| **SameSite Policy** | `sameSite: 'strict'` | Prevents CSRF attacks (cross-site request forgery) |
| **Dual Tokens** | Access (15m) + Refresh (7d) | Short-lived access token limits damage from theft; long-lived refresh token improves UX |
| **Token Revocation** | Refresh tokens stored in DB | Server can invalidate tokens on logout or security breach |
| **Unique Emails** | `unique: true` in schema | Prevents multiple accounts with same email |
| **Input Validation** | Checked in controllers & services | Prevents malformed data and injection attacks |
| **Centralized Error Handling** | Error middleware | Prevents leaking sensitive info in error messages |

---

## 📊 Token Lifecycle

```
┌─────────────────────────────────────────────────────────────────┐
│                        ACCESS TOKEN (15 minutes)                 │
├─────────────────────────────────────────────────────────────────┤
│ • Used for every API request                                     │
│ • Short expiry improves security                                 │
│ • When expired → Use refresh token to get new access token       │
│ • Signature verified on every request (no DB lookup needed)      │
│ • Cannot be manually revoked                                     │
└─────────────────────────────────────────────────────────────────┘

            ↓ (when expired, use refresh token)

┌─────────────────────────────────────────────────────────────────┐
│                     REFRESH TOKEN (7 days)                       │
├─────────────────────────────────────────────────────────────────┤
│ • Used only to get new access tokens                             │
│ • Stored in database (can be revoked)                            │
│ • Long expiry allows seamless user experience                    │
│ • On logout → Token deleted from DB (cannot be reused)          │
│ • Auto-expires after 1 day in DB (TTL index)                    │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🧪 Testing the API

### Using cURL

**1. Register a new user:**
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"john","email":"john@test.com","password":"Pass123"}'
```

**2. Login:**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@test.com","password":"Pass123"}'
```

**3. Access protected route:**
```bash
curl -X GET http://localhost:5000/api/user/profile \
  -b "accessToken=<token_from_previous_response>"
```

**4. Refresh access token:**
```bash
curl -X POST http://localhost:5000/api/auth/refresh \
  -b "refreshToken=<token_from_login>"
```

**5. Logout:**
```bash
curl -X POST http://localhost:5000/api/auth/logout \
  -b "refreshToken=<token_from_login>"
```

---

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

### 8. **`src/controllers/auth.controller.js`** - Request Handlers

Controllers handle HTTP requests and delegate business logic to services. They are thin and focused on request/response handling:

#### **`registerController`** - User Registration Request Handler

```javascript
import { registerService } from "../services/auth.services.js";

const registerController = async (req, res, next) => {
    const { username, email, password } = req.body;

    try {
        // Delegate registration logic to service layer
        const data = await registerService(username, email, password);

        // Set access token in HTTP-only cookie
        res.cookie("accessToken", data.accessToken, {
            httpOnly: true,
            secure: NODE_ENV === 'production',
            sameSite: 'strict',
            path: '/'
        });

        // Set refresh token in HTTP-only cookie
        res.cookie("refreshToken", data.refreshToken, {
            httpOnly: true,
            secure: NODE_ENV === 'production',
            sameSite: 'strict',
            path: '/'
        });

        // Send success response
        res.status(201).json({
            message: "User registered successfully",
            user: {
                _id: data.newUser._id,
                username: data.newUser.username,
                email: data.newUser.email
            }
        });
    } catch (error) {
        // Pass error to error handling middleware
        next(error);
    }
}
```

**Flow:**
1. Extracts username, email, password from request body
2. Calls `registerService()` which handles all business logic
3. Sets tokens in HTTP-only cookies (secure, JS cannot access)
4. Returns user data in response
5. If error occurs, passes to error middleware

**Why separate controller from service?**
- Controller: Focuses on HTTP (requests, responses, status codes)
- Service: Focuses on business logic (validation, encryption, token generation)
- This separation makes testing easier and code more maintainable

---

### 9. **`src/services/auth.services.js`** - Authentication Business Logic

Services contain the core business logic. The `registerService` function handles user registration:

```javascript
import bcrypt from "bcryptjs";
import { createUser, getUserByEmail } from "../repositories/user.repository.js";
import { createToken } from "../repositories/token.repository.js";
import { createError } from "../utils/error.util.js";
import { generateTokens } from "./token.service.js";

const registerService = async (username, email, password) => {
    // Validation: Check if all fields are provided
    if (!username || !email || !password) {
        throw createError("All fields are required", 400);
    }

    // Check if user with this email already exists
    const isUserExist = await getUserByEmail(email);
    if (isUserExist) {
        throw createError("User already exists", 400);
    }

    // Hash password using bcrypt (salting rounds: 10)
    // NEVER store plain passwords! Hashing is one-way encryption
    const hashPassword = await bcrypt.hash(password, 10);

    // Create new user in database via repository
    const newUser = await createUser(username, email, hashPassword);

    // Generate both access and refresh tokens via token service
    const { accessToken, refreshToken } = generateTokens(newUser._id);

    // Store refresh token in database via repository
    await createToken(newUser._id, refreshToken);

    // Return generated user and tokens to controller
    return { newUser, accessToken, refreshToken };
}

export { registerService };
```

**Flow breakdown:**
1. **Validation**: Ensures all required fields are present
2. **Check Uniqueness**: Verifies email doesn't already exist
3. **Password Hashing**: Encrypts password using bcrypt
4. **User Creation**: Calls repository to save user to database
5. **Token Generation**: Calls token service to create access + refresh tokens
6. **Token Storage**: Stores refresh token in database for future validation
7. **Return Data**: Passes user and tokens back to controller

**Benefits of service layer:**
- Business logic is isolated and testable
- Can be reused by different controllers
- Easy to maintain - changes to logic happen in one place
- Error handling is centralized

---

### 10. **`src/services/token.service.js`** - Token Generation

```javascript
import jwt from "jsonwebtoken";
import { JWT_SECRET_ACCESS_TOKEN, JWT_SECRET_REFRESH_TOKEN, JWT_ACCESS_TOKEN_EXPIRES_IN, JWT_REFRESH_TOKEN_EXPIRES_IN } from "../config/env/env.js";

const generateTokens = (userId) => {
    // Create access token (short-lived, 15 minutes)
    const accessToken = jwt.sign(
        { id: userId },                     // Payload: user ID
        JWT_SECRET_ACCESS_TOKEN,             // Secret for signing
        { expiresIn: JWT_ACCESS_TOKEN_EXPIRES_IN }
    );

    // Create refresh token (long-lived, 7 days)
    const refreshToken = jwt.sign(
        { id: userId },
        JWT_SECRET_REFRESH_TOKEN,
        { expiresIn: JWT_REFRESH_TOKEN_EXPIRES_IN }
    );

    return { accessToken, refreshToken };
}

export { generateTokens };
```

**Token Types:**
- **Access Token**: Short-lived (15 min), used for API requests. If compromised, limited damage.
- **Refresh Token**: Long-lived (7 days), used only to get new access tokens. Stored in database for revocation.

---

### 11. **`src/repositories/user.repository.js`** - User Data Operations

Repositories handle all database operations for a specific model:

```javascript
import User from "../models/user.model.js";

// Get user by email
const getUserByEmail = async (email) => {
    return await User.findOne({ email });
}

// Create new user
const createUser = async (username, email, hashPassword) => {
    return await User.create({
        username,
        email,
        password: hashPassword
    });
}

export { getUserByEmail, createUser };
```

**Purpose:**
- Centralizes database queries
- Makes it easy to swap databases (MySQL, PostgreSQL) without changing service logic
- Single point of change for data access patterns

---

### 12. **`src/repositories/token.repository.js`** - Token Data Operations

```javascript
import Token from "../models/tokens.model.js";

// Store refresh token in database
const createToken = async (userId, token) => {
    return await Token.create({
        userId,
        token
    });
}

// Get token by user ID
const getTokenByUserId = async (userId) => {
    return await Token.findOne({ userId });
}

// Delete token (for logout)
const deleteToken = async (userId) => {
    return await Token.deleteOne({ userId });
}

export { createToken, getTokenByUserId, deleteToken };
```

**Why store refresh tokens?**
- Allows server to invalidate tokens (logout, security breach)
- Tracks which devices have valid sessions
- Can implement token rotation for extra security

---

### 13. **`src/utils/error.util.js`** - Error Handling

```javascript
export const createError = (message, statusCode) => {
    const error = new Error(message);
    error.statusCode = statusCode;
## 🔑 Environment Variables

Create a `.env` file in the root directory:

```bash
# Server Configuration
PORT=5000
NODE_ENV=development

# MongoDB Configuration
MONGO_URI=mongodb://localhost:27017/auth-jwt-mern
# For MongoDB Atlas: mongodb+srv://username:password@cluster.mongodb.net/auth-jwt-mern

# JWT Secrets (use strong random strings)
JWT_SECRET_ACCESS_TOKEN=your_super_secret_access_token_key_here_min_32_chars
JWT_SECRET_REFRESH_TOKEN=your_super_secret_refresh_token_key_here_min_32_chars

# Token Expiration Times
JWT_ACCESS_TOKEN_EXPIRES_IN=15m
JWT_REFRESH_TOKEN_EXPIRES_IN=7d
```

**Security Notes:**
- Use strong, random strings for JWT secrets (at least 32 characters)
- Different secrets for access and refresh tokens
- Never commit `.env` file to version control
- Generate secure secrets: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`

---

## ⚠️ Error Handling

The application includes centralized error handling via `error.middleware.js`:

| HTTP Status | Meaning | Example |
|-------------|---------|---------|
| 200 | Success | Login/Refresh successful |
| 201 | Created | User registration successful |
| 400 | Bad Request | Missing fields, user already exists |
| 401 | Unauthorized | Invalid credentials, expired token |
| 500 | Server Error | Database connection failed |

**Common Error Responses:**
```json
{ "message": "All fields are required" }
{ "message": "Invalid User credentials" }
{ "message": "User already exists" }
{ "message": "Token got expired" }
{ "message": "Invalid User" }
```

---

## 📚 Additional Resources

- **JWT**: [jwt.io](https://jwt.io) - Learn about JWT format and implementation
- **Mongoose**: [mongoosejs.com](https://mongoosejs.com) - MongoDB object modeling
- **Express**: [expressjs.com](https://expressjs.com) - Web framework documentation
- **bcryptjs**: [github.com/dcodeIO/bcrypt.js](https://github.com/dcodeIO/bcrypt.js) - Password hashing
- **MongoDB**: [mongodb.com](https://mongodb.com) - Database documentation

---

## 📈 Performance Considerations

| Optimization | Implementation | Benefit |
|--------------|----------------|---------|
| **Connection Pooling** | Mongoose default | Reuses DB connections |
| **Token Signature Verification** | No DB lookup | Fast (cryptographic only) |
| **Password Hashing** | bcryptjs (10 rounds) | Slow hash prevents brute force |
| **HTTP-Only Cookies** | Browser auto-sends | Reduces network overhead |
| **TTL Index** | MongoDB expires tokens | Auto-cleanup of old tokens |

---

## 🚀 Deployment Checklist

Before deploying to production:

- [ ] Set `NODE_ENV=production`
- [ ] Use strong, random JWT secrets
- [ ] Enable HTTPS for all endpoints
- [ ] Set `secure: true` for cookies
- [ ] Use MongoDB Atlas or managed MongoDB service
- [ ] Set proper CORS origins (not `*`)
- [ ] Add rate limiting middleware
- [ ] Set up logging and monitoring
- [ ] Configure database backups
- [ ] Use environment variables for all secrets
- [ ] Enable MongoDB authentication (username/password)
- [ ] Add request validation schemas (joi, zod)
- [ ] Test all authentication flows thoroughly

---

## 🤝 Contributing

To extend this project:

1. **Add Input Validation**: Use joi or zod for schema validation
2. **Add Role-Based Access**: Create roles and permissions
3. **Add Password Reset**: Email-based password recovery
4. **Add Email Verification**: Verify email on signup
5. **Add Refresh Token Rotation**: Issue new token on each refresh
6. **Add Rate Limiting**: Prevent brute force attacks
7. **Add Logging**: Structured logging for debugging
8. **Add Tests**: Unit and integration tests

---

## 📄 License

ISC

---

## 📞 Support

For issues or questions, please open a GitHub issue or contact the repository owner.

---

**Last Updated:** February 19, 2026
**Version:** 1.0.0
**Type:** ES6 Modules (ESM)

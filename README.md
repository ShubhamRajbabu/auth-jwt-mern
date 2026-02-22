# Auth JWT MERN - Complete Documentation

A secure JWT-based authentication and task management backend built with Node.js, Express, and MongoDB. Implements dual-token authentication (Access & Refresh tokens), bcrypt password hashing, HTTP-only cookie storage, role-based access control, and a clean layered architecture.

## 📋 Table of Contents
1. [Project Overview](#project-overview)
2. [Features](#features)
3. [Tech Stack](#tech-stack)
4. [Project Structure](#project-structure)
5. [Installation & Setup](#installation--setup)
6. [Environment Variables](#environment-variables)
7. [API Endpoints](#api-endpoints)
8. [Architecture](#architecture)
9. [Dependencies](#dependencies)

---

## 🎯 Project Overview

This is a **production-ready MERN Stack Authentication & Task Management System** using **JWT (JSON Web Tokens)**. It provides a complete, secure authentication mechanism with comprehensive task management capabilities and role-based access control.

The application implements:
- Secure user registration and login with bcrypt password hashing
- Dual-token authentication (Access tokens: 15m, Refresh tokens: 7d)
- HTTP-only cookie-based token storage (XSS/CSRF protection)
- Protected routes with JWT middleware
- Task CRUD operations with user isolation
- Admin-only task management endpoints
- Clean layered architecture (Routes → Controllers → Services → Repositories → Models)

---

## ✨ Features

- ✅ **User Authentication** - Secure registration/login with bcrypt hashing
- ✅ **JWT Token Management** - Access tokens (15m) & Refresh tokens (7d)
- ✅ **HTTP-Only Cookies** - Secure token storage with XSS/CSRF protection
- ✅ **Token Refresh** - Seamless token renewal without re-login
- ✅ **User Logout** - Token invalidation and database cleanup
- ✅ **Protected Routes** - JWT-based middleware protection
- ✅ **Task Management** - Full CRUD operations with user isolation
- ✅ **Admin Routes** - Separate admin endpoints for task oversight
- ✅ **Role-Based Access** - Admin role middleware for authorization
- ✅ **Error Handling** - Centralized error middleware with custom errors
- ✅ **Layered Architecture** - Clean separation of concerns

---

## 🛠 Tech Stack

| Technology | Version | Purpose |
|-----------|---------|---------|
| Node.js | 14+ | JavaScript runtime |
| Express | ^5.2.1 | Web framework |
| MongoDB | Latest | NoSQL database |
| Mongoose | ^9.2.1 | MongoDB ODM |
| JWT | ^9.0.3 | Token authentication |
| bcryptjs | ^3.0.3 | Password hashing |
| Cookie-Parser | ^1.4.7 | Cookie middleware |
| CORS | ^2.8.6 | Cross-origin requests |
| Dotenv | ^17.3.1 | Environment management |
| Nodemon | ^3.1.11 | Development auto-reload |

---

## 📁 Project Structure

```
auth-jwt-mern/
├── package.json                    # Dependencies & npm scripts
├── server.js                       # Application entry point
├── README.md                       # This file
└── src/
    ├── app.js                      # Express setup & middleware
    ├── config/
    │   ├── db/
    │   │   └── db.js               # MongoDB connection setup
    │   └── env/
    │       └── env.js              # Environment variables loader
    ├── controllers/
    │   ├── auth.controller.js      # Auth request handlers
    │   ├── user.controller.js      # User profile handlers
    │   └── task.controller.js      # Task request handlers (user & admin)
    ├── services/
    │   ├── auth.services.js        # Auth business logic
    │   ├── token.service.js        # Token generation & refresh
    │   ├── user.service.js         # User business logic
    │   └── task.services.js        # Task business logic
    ├── repositories/
    │   ├── user.repository.js      # User data access
    │   ├── token.repository.js     # Token data access
    │   └── task.repository.js      # Task data access
    ├── models/
    │   ├── user.model.js           # User schema
    │   ├── tokens.model.js         # Refresh token schema
    │   └── task.model.js           # Task schema
    ├── middlewares/
    │   ├── auth.middleware.js      # JWT verification
    │   ├── role.middleware.js      # Role-based authorization
    │   └── error.middleware.js     # Global error handling
    ├── routes/
    │   ├── auth.routes.js          # Authentication endpoints
    │   ├── user.routes.js          # User endpoints
    │   └── task.routes.js          # Task endpoints
    └── utils/
        └── error.util.js           # Custom error utilities
```

---

## 🚀 Installation & Setup

### Prerequisites
- **Node.js** v14+ ([download](https://nodejs.org))
- **MongoDB** (local or [MongoDB Atlas](https://www.mongodb.com/cloud/atlas))
- **npm** package manager

### Step-by-Step Setup

1. **Navigate to project directory**
```bash
cd /Users/shubhamshubham/Desktop/auth-jwt-mern
```

2. **Install dependencies**
```bash
npm install
```

3. **Create `.env` file** in the root directory
```bash
PORT=5000
NODE_ENV=development

# MongoDB
MONGO_URI=mongodb://localhost:27017/auth-jwt-mern

# JWT Secrets (use strong, random values in production)
JWT_SECRET_ACCESS_TOKEN=your_super_secret_access_token_key
JWT_SECRET_REFRESH_TOKEN=your_super_secret_refresh_token_key

# Token Expiry
JWT_ACCESS_TOKEN_EXPIRES_IN=15m
JWT_REFRESH_TOKEN_EXPIRES_IN=7d
```

4. **Start the server**
```bash
npm run dev      # Development (auto-restart with nodemon)
npm start        # Production
```

5. **Verify server is running**
```bash
curl http://localhost:5000/api/auth/register
```

---

## 🔐 Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | 5000 | Server port |
| `NODE_ENV` | development | Environment mode |
| `MONGO_URI` | - | MongoDB connection string |
| `JWT_SECRET_ACCESS_TOKEN` | - | Access token secret key |
| `JWT_SECRET_REFRESH_TOKEN` | - | Refresh token secret key |
| `JWT_ACCESS_TOKEN_EXPIRES_IN` | 15m | Access token TTL |
| `JWT_REFRESH_TOKEN_EXPIRES_IN` | 7d | Refresh token TTL |

**Production Tips:** Use strong, unique secrets and store them securely (never commit `.env`).

---

## 📡 API Endpoints

All endpoints use base path `/api`

### Authentication Routes (`/api/auth`)

#### 1. **POST /api/auth/register** - Register new user
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "john_doe",
    "email": "john@example.com",
    "password": "securePassword123"
  }'
```
**Response (201):** Sets `accessToken` and `refreshToken` cookies
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

#### 2. **POST /api/auth/login** - Authenticate user
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "securePassword123"
  }'
```
**Response (200):** Sets `accessToken` and `refreshToken` cookies
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

#### 3. **POST /api/auth/refresh** - Refresh access token
```bash
curl -X POST http://localhost:5000/api/auth/refresh \
  -b "refreshToken=<your_refresh_token>"
```
**Response (200):** Sets new `accessToken` cookie
```json
{
  "message": "Access token refreshed",
  "newAccessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### 4. **POST /api/auth/logout** - Logout user
```bash
curl -X POST http://localhost:5000/api/auth/logout \
  -b "refreshToken=<your_refresh_token>"
```
**Response (200):** Clears all auth cookies
```json
{
  "message": "User logout successfully"
}
```

---

### User Routes (`/api/user`)

#### 1. **GET /api/user/profile** - Get user profile
Requires: Valid `accessToken` cookie
```bash
curl -X GET http://localhost:5000/api/user/profile \
  -b "accessToken=<your_access_token>"
```
**Response (200):**
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

---

### Task Routes (`/api/task`)

All task routes require valid `accessToken` cookie.

#### User Task Endpoints

1. **GET /api/task/getAllTasksByUserId** - Get all user tasks
```bash
curl -X GET http://localhost:5000/api/task/getAllTasksByUserId \
  -b "accessToken=<your_access_token>"
```
**Response (200):**
```json
{
  "tasks": [
    {
      "_id": "60c5ebcd12f3a4b5c8d1e2f3",
      "title": "Complete project",
      "description": "Finish JWT auth",
      "userId": "507f1f77bcf86cd799439011",
      "status": "pending",
      "createdAt": "2026-02-19T10:30:00.000Z"
    }
  ]
}
```

2. **GET /api/task/getTaskById/:taskId** - Get specific task
```bash
curl -X GET http://localhost:5000/api/task/getTaskById/60c5ebcd12f3a4b5c8d1e2f3 \
  -b "accessToken=<your_access_token>"
```
**Response (200):**
```json
{
  "task": { /* task object */ }
}
```

3. **POST /api/task/createTask** - Create new task
```bash
curl -X POST http://localhost:5000/api/task/createTask \
  -H "Content-Type: application/json" \
  -b "accessToken=<your_access_token>" \
  -d '{
    "title": "New Task",
    "description": "Task description"
  }'
```
**Response (201):**
```json
{
  "task": { /* created task object */ }
}
```

4. **PUT /api/task/updateTask/:taskId** - Update task
```bash
curl -X PUT http://localhost:5000/api/task/updateTask/60c5ebcd12f3a4b5c8d1e2f3 \
  -H "Content-Type: application/json" \
  -b "accessToken=<your_access_token>" \
  -d '{
    "title": "Updated Title",
    "status": "completed"
  }'
```
**Response (200):**
```json
{
  "task": { /* updated task object */ }
}
```

5. **DELETE /api/task/deleteTaskById/:taskId** - Delete task
```bash
curl -X DELETE http://localhost:5000/api/task/deleteTaskById/60c5ebcd12f3a4b5c8d1e2f3 \
  -b "accessToken=<your_access_token>"
```
**Response (204):** No content

6. **DELETE /api/task/deleteAllTasksForUser** - Delete all user tasks
```bash
curl -X DELETE http://localhost:5000/api/task/deleteAllTasksForUser \
  -b "accessToken=<your_access_token>"
```
**Response (204):** No content

#### Admin Task Endpoints

All admin routes require `accessToken` + `admin` role.

1. **GET /api/task/admin/getAllAdminTasks** - Get all tasks
2. **GET /api/task/admin/getAdminTaskByTaskId/:taskId** - Get specific task
3. **PUT /api/task/admin/updateAdminTaskByTaskId/:taskId** - Update any task
4. **DELETE /api/task/admin/deleteAdminTaskByTaskId/:taskId** - Delete any task
5. **DELETE /api/task/admin/deleteAllAdminTasks** - Delete all tasks

---

## 🏗 Architecture

### Layered Architecture

```
Routes (Express Router)
    ↓
Controllers (Request handlers)
    ↓
Services (Business logic)
    ↓
Repositories (Data access)
    ↓
Models (Mongoose schemas)
    ↓
MongoDB (Database)
```

### Authentication Flow

1. **Registration/Login:** User credentials → hashed password stored in DB
2. **Token Generation:** Both access & refresh tokens created, stored as HTTP-only cookies
3. **Request:** Client sends request with cookies
4. **Auth Middleware:** Validates access token JWT
5. **Token Refresh:** Expired access token → use refresh token for new access token
6. **Logout:** Refresh token deleted from DB, cookies cleared

### Error Handling

Global error middleware (`error.middleware.js`) catches all errors and returns standardized responses with appropriate HTTP status codes.

---

## 📦 Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| **express** | ^5.2.1 | REST API framework & routing |
| **mongoose** | ^9.2.1 | MongoDB ODM with schema validation |
| **jsonwebtoken** | ^9.0.3 | JWT creation & verification |
| **bcryptjs** | ^3.0.3 | Password hashing with salt rounds |
| **cookie-parser** | ^1.4.7 | Parse HTTP cookies from requests |
| **cors** | ^2.8.6 | Cross-origin resource sharing |
| **dotenv** | ^17.3.1 | Environment variable management |
| **nodemon** | ^3.1.11 | Development auto-restart (dev only) |

---

## 📝 Scripts

```bash
npm run dev      # Start with nodemon (auto-restart on changes)
npm start        # Start production server
```

Both commands run `server.js` as the entry point.

---

## 🔒 Security Features

- **Password Hashing:** bcryptjs with salt rounds
- **JWT Tokens:** Cryptographically signed, stateless authentication
- **HTTP-Only Cookies:** Prevents XSS attacks
- **Token Expiry:** Short-lived access tokens + long-lived refresh tokens
- **Role-Based Access:** Admin middleware for protected operations
- **Error Middleware:** Sanitized error responses
- **CORS:** Configurable cross-origin requests

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit changes
4. Push to branch
5. Create a Pull Request

---

## 📄 License

This project is licensed under the ISC License.
- `src/models/` — mongoose schemas
- `src/middlewares/` — `auth.middleware.js` and `error.middleware.js`

---

## Notes & recommendations

- Use secure, randomly generated values for JWT secrets in production.
- Serve over HTTPS in production to protect cookies in transit.
- Consider setting `SameSite` and secure cookie flags when setting cookies.

If you want, I can also:

- Add an example `.env.example` file
- Add Postman collection or OpenAPI spec for the API
- Add setup scripts for MongoDB Atlas

---

## License

This project does not contain a license file. Add one if you plan to publish or share.

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

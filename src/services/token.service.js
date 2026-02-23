import jwt from "jsonwebtoken";
import { JWT_ACCESS_TOKEN_EXPIRES_IN, JWT_REFRESH_TOKEN_EXPIRES_IN, JWT_SECRET_ACCESS_TOKEN, JWT_SECRET_REFRESH_TOKEN } from "../config/env/env.js";
import { createError } from "../utils/error.util.js";

const generateTokens = (userData) => {
    console.log("Generating tokens for userId: ", userData._id);
    console.log("User details: ", userData);
    const accessToken = jwt.sign({ id: userData._id, role: userData.role }, JWT_SECRET_ACCESS_TOKEN, { expiresIn: JWT_ACCESS_TOKEN_EXPIRES_IN })

    const refreshToken = jwt.sign({ id: userData._id, role: userData.role }, JWT_SECRET_REFRESH_TOKEN, { expiresIn: JWT_REFRESH_TOKEN_EXPIRES_IN })
    console.log("Generated access token: ", accessToken);
    console.log("Generated refresh token: ", refreshToken);
    return { accessToken, refreshToken };
}

const tokenValidator = (token) => {
    try {
        return jwt.verify(token, JWT_SECRET_REFRESH_TOKEN);
    } catch (error) {
        throw createError("Invalid or expired refresh token", 401);
    }
}

export const tokenService = { generateTokens, tokenValidator };
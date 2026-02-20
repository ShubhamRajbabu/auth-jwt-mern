import jwt from "jsonwebtoken";
import { JWT_ACCESS_TOKEN_EXPIRES_IN, JWT_REFRESH_TOKEN_EXPIRES_IN, JWT_SECRET_ACCESS_TOKEN, JWT_SECRET_REFRESH_TOKEN } from "../config/env/env.js";
import { createError } from "../utils/error.util.js";

const generateTokens = (userId) => {
    console.log("Generating tokens for userId: ", userId);
    const accessToken = jwt.sign({ id: userId }, JWT_SECRET_ACCESS_TOKEN, { expiresIn: JWT_ACCESS_TOKEN_EXPIRES_IN })

    const refreshToken = jwt.sign({ id: userId }, JWT_SECRET_REFRESH_TOKEN, { expiresIn: JWT_REFRESH_TOKEN_EXPIRES_IN })

    return { accessToken, refreshToken };
}

const tokenValidator = (token) => {
    try {
        return jwt.verify(token, JWT_SECRET_REFRESH_TOKEN);
    } catch (error) {
        throw createError("Invalid or expired refresh token", 401);
    }
}

const generateAccessTokenById = (userId) => {
    const accessToken = jwt.sign({ id: userId }, JWT_SECRET_ACCESS_TOKEN, { expiresIn: JWT_ACCESS_TOKEN_EXPIRES_IN });
    return accessToken;
}

export const tokenService = { generateTokens, tokenValidator, generateAccessTokenById };
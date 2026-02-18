import jwt from "jsonwebtoken";
import { JWT_ACCESS_TOKEN_EXPIRES_IN, JWT_REFRESH_TOKEN_EXPIRES_IN, JWT_SECRET_ACCESS_TOKEN, JWT_SECRET_REFRESH_TOKEN } from "../config/env/env.js";

const generateTokens = (userId) => {
    const accessToken = jwt.sign({ id: userId }, JWT_SECRET_ACCESS_TOKEN, { expiresIn: JWT_ACCESS_TOKEN_EXPIRES_IN })

    const refreshToken = jwt.sign({ id: userId }, JWT_SECRET_REFRESH_TOKEN, { expiresIn: JWT_REFRESH_TOKEN_EXPIRES_IN })

    return { accessToken, refreshToken };
}

export { generateTokens };
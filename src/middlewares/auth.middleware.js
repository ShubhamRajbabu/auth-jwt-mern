import { JWT_SECRET_ACCESS_TOKEN } from "../config/env/env.js";
import jwt from "jsonwebtoken";
import { createError } from "../utils/error.util.js";

const authMiddleware = (req, res, next) => {
    const { accessToken } = req.cookies;
    if (!accessToken) {
        next(createError("Please login again", 401));
        return;
    }
    try {
        const decoded = jwt.verify(accessToken, JWT_SECRET_ACCESS_TOKEN);

        if (!decoded || !decoded.id) {
            next(createError("Invalid access token", 401));
        }

        req.user = decoded;
        next();
    } catch (error) {
        next(createError("Token got expired", 401));
    }
}

export default authMiddleware;
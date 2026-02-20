import { JWT_SECRET_ACCESS_TOKEN } from "../config/env/env.js";
import jwt from "jsonwebtoken";

const authMiddleware = (req, res, next) => {
    const { accessToken } = req.cookies;
    if (!accessToken) {
        throw createError(401, "Access token is missing");
    }
    try {
        const decoded = jwt.verify(accessToken, JWT_SECRET_ACCESS_TOKEN);

        if (!decoded || !decoded.id) {
            throw createError(401, "Invalid access token");
        }

        req.user = decoded;
        next();
    } catch (error) {
        next(createError(401, "Token got expired"));
    }
}

export default authMiddleware;
import { JWT_SECRET_ACCESS_TOKEN } from "../config/env/env.js";
import jwt from "jsonwebtoken";

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

export default authMiddleware;
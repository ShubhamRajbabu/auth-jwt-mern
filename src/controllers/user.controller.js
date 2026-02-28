
import { userService } from "../services/user.service.js";
import logger from "../utils/logger.util.js";

const getUserProfile = async (req, res, next) => {
    const user = req.user; //from authMiddleware, we are getting the user details 
    try {
        const userProfile = await userService.getUserDetailsById(user.id);
        logger.info("User profile fetched", {
            userId: user.id,
            ip: req.ip,
            method: req.method,
            route: req.originalUrl
        });
        return res.status(200).json({ user: userProfile });
    } catch (error) {
        next(error);
    }

}

export const userController = { getUserProfile };
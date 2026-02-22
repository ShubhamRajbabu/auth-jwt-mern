
import { userService } from "../services/user.service.js";

const getUserProfile = async (req, res, next) => {
    const user = req.user; //from authMiddleware, we are getting the user details 
    try {
        const userProfile = await userService.getUserDetailsById(user.id);
        return res.status(200).json({ user: userProfile });
    } catch (error) {
        next(error);
    }

}

export const userController = { getUserProfile };
import { userRepository } from "../repositories/user.repository.js";
import { createError } from "../utils/error.util.js";

const getUserDetailsById = async (userId) => {
    const userDetails = await userRepository.getUserById(userId);
    if (!userDetails) {
        throw createError("User not found", 404);
    }
    return userDetails;
}

export const userService = { getUserDetailsById };
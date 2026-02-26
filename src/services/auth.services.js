
import bcrypt from "bcryptjs";
import { userRepository } from "../repositories/user.repository.js";
import { tokenRepository } from "../repositories/token.repository.js";
import { createError } from "../utils/error.util.js";
import { tokenService } from "./token.service.js";
import { uploadToCloudinary } from "../utils/cloudinary.util.js";

const registerUser = async (username, email, password, avatarFile) => {
    let avatarUrl = null;
    if (!username || !email || !password) {
        throw createError("All fields are required", 400);
    }

    try {
        const isUserExist = await userRepository.getUserByEmail(email);
        if (isUserExist) {
            throw createError("User already exists", 400);
        }

        const hashPassword = await bcrypt.hash(password, 10);
        if (avatarFile) {
            avatarUrl = await uploadToCloudinary(avatarFile.path);
        }

        const newUser = await userRepository.createUser(username, email, hashPassword, avatarUrl);

        const { accessToken, refreshToken } = tokenService.generateTokens(newUser);

        await tokenRepository.createToken(newUser._id, refreshToken);

        return { newUser, accessToken, refreshToken };
    } catch (error) {
        throw createError(error.message, 500);
    }
}

const loginUser = async (email, password) => {
    if (!email || !password) {
        throw createError("All fields are required", 400);
    }

    try {
        const userData = await userRepository.getUserByEmail(email);
        if (!userData) {
            throw createError("Invalid User credentials", 401);
        }

        const isPasswordValid = await bcrypt.compare(password, userData.password);
        if (!isPasswordValid) {
            throw createError("Invalid User credentials", 401);
        }

        //not keeping multiple sessions of the same user,
        //  so deleting any existing refresh token for the user from db,
        //  if exists, before creating and storing new refresh token for the user in db
        await tokenRepository.deleteTokenByUserId(userData._id);

        const { accessToken, refreshToken } = tokenService.generateTokens(userData);

        await tokenRepository.createToken(userData._id, refreshToken);

        return {
            userData,
            accessToken,
            refreshToken
        }
    } catch (error) {
        throw createError("Internal server error while User loggin in", 500);
    }



}

const getTokens = async (refreshToken) => {
    if (!refreshToken) {
        throw createError("Invalid or expired token", 401);
    }

    try {
        const decoded = tokenService.tokenValidator(refreshToken);
        if (!decoded) {
            throw createError("Invalid or expired refresh token", 401);
        }

        const dbTokenByUserId = await tokenRepository.getTokenFromDB(refreshToken, decoded.id);
        if (!dbTokenByUserId) {
            throw createError("Invalid or expired refresh token", 401);
        }

        await tokenRepository.deleteTokenByUserId(decoded.id);

        const userDetails = await userRepository.getUserById(decoded.id);

        const tokens = tokenService.generateTokens(userDetails);

        await tokenRepository.createToken(decoded.id, tokens.refreshToken);

        return tokens;
    } catch (error) {
        throw createError("Internal server error while getTokens", 500);
    }

}

const logoutUser = async (refreshToken) => {
    await tokenRepository.deleteToken(refreshToken);
}
export const authService = { registerUser, loginUser, getTokens, logoutUser };
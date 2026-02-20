
import bcrypt from "bcryptjs";
import { userRepository } from "../repositories/user.repository.js";
import { tokenRepository } from "../repositories/token.repository.js";
import { createError } from "../utils/error.util.js";
import { tokenService } from "./token.service.js";

const registerService = async (username, email, password) => {

    if (!username || !email || !password) {
        throw createError("All fields are required", 400);
    }

    const isUserExist = await userRepository.getUserByEmail(email);
    if (isUserExist) {
        throw createError("User already exists", 400);
    }

    const hashPassword = await bcrypt.hash(password, 10);

    const newUser = await userRepository.createUser(username, email, hashPassword);

    const { accessToken, refreshToken } = tokenService.generateTokens(newUser._id);

    await tokenRepository.createToken(newUser._id, refreshToken);

    return { newUser, accessToken, refreshToken };
}

const loginService = async (email, password) => {
    if (!email || !password) {
        throw createError("All fields are required", 400);
    }

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

    const { accessToken, refreshToken } = tokenService.generateTokens(userData._id);

    await tokenRepository.createToken(userData._id, refreshToken);

    return {
        userData,
        accessToken,
        refreshToken
    }

}

const getTokens = async (refreshToken) => {
    if (!refreshToken) {
        throw createError("Invalid or expired token", 401);
    }

    const decoded = tokenService.tokenValidator(refreshToken);
    console.log("Decoded refresh token: ", decoded);
    if (!decoded) {
        throw createError("Invalid or expired refresh token", 401);
    }

    const dbTokenByUserId = await tokenRepository.getTokenFromDB(refreshToken);
    console.log("DB token: ", dbTokenByUserId);
    if (!dbTokenByUserId) {
        throw createError("Invalid or expired refresh token", 401);
    }

    await tokenRepository.deleteTokenByUserId(decoded.id);
    console.log("Old refresh token deleted from DB");

    const tokens = tokenService.generateTokens(decoded.id);
    console.log("New tokens generated");

    await tokenRepository.createToken(decoded.id, tokens.refreshToken);

    return tokens;
}

const logoutService = async (refreshToken) => {
    await tokenRepository.deleteToken(refreshToken);
}
export const authService = { registerService, loginService, getTokens, logoutService };
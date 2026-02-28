import { NODE_ENV } from "../config/env/env.js";
import { authService } from "../services/auth.services.js";
import logger from "../utils/logger.util.js";

const cookieOptions = {
    httpOnly: true,
    secure: NODE_ENV === "production",
    sameSite: "strict",
    path: "/"
};

const registerController = async (req, res, next) => {
    const { username, email, password } = req.body;
    const avatarFile = req.file;

    try {
        const data = await authService.registerUser(
            username,
            email,
            password,
            avatarFile
        );

        res.cookie("accessToken", data.accessToken, cookieOptions);
        res.cookie("refreshToken", data.refreshToken, cookieOptions);

        logger.info("User registered successfully", {
            userId: data.newUser._id,
            email: data.newUser.email,
            ip: req.ip
        });

        return res.status(201).json({
            message: "User registered successfully",
            user: {
                _id: data.newUser._id,
                username: data.newUser.username,
                email: data.newUser.email
            }
        });

    } catch (error) {
        next(error);
    }
};

const loginController = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        const { userData, accessToken, refreshToken } =
            await authService.loginUser(email, password);

        res.cookie("accessToken", accessToken, cookieOptions);
        res.cookie("refreshToken", refreshToken, cookieOptions);

        logger.info("User logged in", {
            userId: userData._id,
            email: userData.email,
            ip: req.ip,
            userAgent: req.headers["user-agent"]
        });

        return res.status(200).json({
            message: "User logged in successfully",
            user: {
                _id: userData._id,
                username: userData.username,
                email: userData.email
            }
        });

    } catch (error) {
        next(error);
    }
};

const refreshTokenController = async (req, res, next) => {
    const { refreshToken } = req.cookies;

    try {
        const tokens = await authService.getTokens(refreshToken);

        res.cookie("accessToken", tokens.accessToken, cookieOptions);
        res.cookie("refreshToken", tokens.refreshToken, cookieOptions);

        logger.info("Access token refreshed", {
            ip: req.ip
        });

        return res
            .status(200)
            .json({ message: "Access token refreshed successfully" });

    } catch (error) {
        next(error);
    }
};

const logoutController = async (req, res, next) => {
    try {
        const { refreshToken } = req.cookies;

        await authService.logoutUser(refreshToken);

        res.clearCookie("accessToken", cookieOptions);
        res.clearCookie("refreshToken", cookieOptions);

        logger.info("User logged out", {
            ip: req.ip
        });

        return res
            .status(200)
            .json({ message: "User logged out successfully" });

    } catch (error) {
        next(error);
    }
};

export const authController = {
    registerController,
    loginController,
    refreshTokenController,
    logoutController
};

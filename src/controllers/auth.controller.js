import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import User from "../models/user.model.js";
import { JWT_ACCESS_TOKEN_EXPIRES_IN, JWT_REFRESH_TOKEN_EXPIRES_IN, JWT_SECRET_ACCESS_TOKEN, JWT_SECRET_REFRESH_TOKEN, NODE_ENV } from "../config/env/env.js";
import Token from "../models/tokens.model.js";

const registerController = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        if (!username || !email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const isUserExist = await User.findOne({ email });
        if (isUserExist) {
            return res.status(400).json({ message: "User already exists" });
        }
        const hashPassword = await bcrypt.hash(password, 10);

        const newUser = await User.create({
            username, email, password: hashPassword
        })
        if (!newUser) {
            return res.status(500).json({ message: "User registration failed" });
        }

        const accessToken = jwt.sign({ id: newUser._id }, JWT_SECRET_ACCESS_TOKEN, { expiresIn: JWT_ACCESS_TOKEN_EXPIRES_IN })
        res.cookie("accessToken", accessToken, {
            httpOnly: true,
            secure: NODE_ENV === 'production',
            sameSite: 'strict'
        });

        const refreshToken = jwt.sign({ id: newUser._id }, JWT_SECRET_REFRESH_TOKEN, { expiresIn: JWT_REFRESH_TOKEN_EXPIRES_IN })
        const storeRefreshTokenIndb = await Token.create({
            userId: newUser._id,
            token: refreshToken
        });

        if (!storeRefreshTokenIndb) {
            return res.status(500).json({ message: "Failed to store refresh token" });
        }

        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: NODE_ENV === 'production',
            sameSite: 'strict'
        });

        res.status(201).json({
            message: "User registered successfully",
            user: {
                _id: newUser._id,
                username: newUser.username,
                email: newUser.email
            }
        });
    } catch (error) {
        console.error("Registration error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

const loginController = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const isUserExist = await User.findOne({ email });
        if (!isUserExist) {
            return res.status(400).json({ message: "Invalid User credentials" });
        }
        const isPasswordValid = await bcrypt.compare(password, isUserExist.password);

        if (!isPasswordValid) {
            return res.status(400).json({ message: "Invalid User credentials" });
        }

        await Token.deleteOne({ userId: isUserExist._id }); //not keeping multiple sessions of the same user, so deleting any existing refresh token for the user from db, if exists, before creating and storing new refresh token for the user in db

        const accessToken = jwt.sign({ id: isUserExist._id }, JWT_SECRET_ACCESS_TOKEN, { expiresIn: JWT_ACCESS_TOKEN_EXPIRES_IN })
        res.cookie("accessToken", accessToken, {
            httpOnly: true,
            secure: NODE_ENV === 'production',
            sameSite: 'strict',
            path: '/' // Set the path to '/' to make the cookie accessible across the entire domain
        });

        const refreshToken = jwt.sign({ id: isUserExist._id }, JWT_SECRET_REFRESH_TOKEN, { expiresIn: JWT_REFRESH_TOKEN_EXPIRES_IN })
        const storeRefreshTokenIndb = await Token.create({
            userId: isUserExist._id,
            token: refreshToken
        });
        if (!storeRefreshTokenIndb) {
            return res.status(500).json({ message: "Failed to store refresh token" });
        }

        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: NODE_ENV === 'production',
            sameSite: 'strict'
        });

        res.status(200).json({
            message: "User logged in successfully",
            user: {
                _id: isUserExist._id,
                username: isUserExist.username,
                email: isUserExist.email
            }
        });
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

const refreshAccessToken = async (req, res) => {
    const { refreshToken } = req.cookies;
    if (!refreshToken) {
        return res.status(401).json({ message: "Refresh token is required" });
    }

    try {
        const isRefreshTokenValid = jwt.verify(refreshToken, JWT_SECRET_REFRESH_TOKEN);

        const refreshTokenInDb = await Token.findOne({ token: refreshToken });
        if (!refreshTokenInDb) {
            return res.status(401).json({ message: "Refresh token not found" });
        }

        const newAccessToken = jwt.sign({ id: isRefreshTokenValid.id }, JWT_SECRET_ACCESS_TOKEN, { expiresIn: JWT_ACCESS_TOKEN_EXPIRES_IN });
        res.cookie("accessToken", newAccessToken, {
            httpOnly: true,
            secure: NODE_ENV === 'production',
            sameSite: 'strict'
        });

        res.status(200).json({ message: "Access token refreshed successfully" });

    } catch (error) {
        console.error("Refresh token error:", error);
        res.status(401).json({ message: "Refresh token is invalid or expired" });
    }
}

const logoutController = async (req, res) => {

    const { refreshToken } = req.cookies;
    if (refreshToken) {
        await Token.deleteOne({ token: refreshToken });
    }

    res.clearCookie("accessToken", {
        httpOnly: true,
        secure: NODE_ENV === 'production',
        sameSite: 'strict'
    });
    res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: NODE_ENV === 'production',
        sameSite: 'strict'
    });

    res.status(200).json({ message: "User logged out successfully" });
}

export { registerController, loginController, refreshAccessToken, logoutController };
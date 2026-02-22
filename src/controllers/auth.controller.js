
import { NODE_ENV } from "../config/env/env.js";
import { authService } from "../services/auth.services.js";

const registerController = async (req, res, next) => {
    const { username, email, password } = req.body;

    try {
        const data = await authService.registerService(username, email, password);

        res.cookie("accessToken", data.accessToken, {
            httpOnly: true,
            secure: NODE_ENV === 'production',
            sameSite: 'strict',
            path: '/'
        });

        res.cookie("refreshToken", data.refreshToken, {
            httpOnly: true,
            secure: NODE_ENV === 'production',
            sameSite: 'strict',
            path: '/'
        });

        res.status(201).json({
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
}

const loginController = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const { userData, accessToken, refreshToken, } = await authService.loginService(email, password)

        res.cookie("accessToken", accessToken, {
            httpOnly: true,
            secure: NODE_ENV === 'production',
            sameSite: 'strict',
            path: '/' // Set the path to '/' to make the cookie accessible across the entire domain
        });

        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: NODE_ENV === 'production',
            sameSite: 'strict',
            path: '/'
        });

        res.status(200).json({
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
}

const refreshTokenController = async (req, res, next) => {
    const { refreshToken } = req.cookies;
    try {
        const tokens = await authService.getTokens(refreshToken);

        console.log("Setting new tokens in cookies: ", tokens);

        res.cookie("accessToken", tokens.accessToken, {
            httpOnly: true,
            secure: NODE_ENV === 'production',
            sameSite: 'strict',
            path: '/'
        });

        res.cookie("refreshToken", tokens.refreshToken, {
            httpOnly: true,
            secure: NODE_ENV === 'production',
            sameSite: 'strict',
            path: '/'
        });

        res.status(200).json({ message: "Access token refreshed successfully" });

    } catch (error) {
        next(error);
    }
}

const logoutController = async (req, res, next) => {

    try {
        const { refreshToken } = req.cookies;
        await authService.logoutService(refreshToken);

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

    } catch (error) {
        next(error);
    }

}

export const authController = { registerController, loginController, refreshTokenController, logoutController };
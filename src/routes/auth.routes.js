import express from 'express';
import { authController } from '../controllers/auth.controller.js';

const authRouter = express.Router();

authRouter.post('/register', authController.registerController);

authRouter.post('/login', authController.loginController);

authRouter.post('/refresh', authController.refreshTokenController);

authRouter.post('/logout', authController.logoutController)

export default authRouter;
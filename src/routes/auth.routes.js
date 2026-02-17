import express from 'express';
import { loginController, logoutController, refreshAccessToken, registerController } from '../controllers/auth.controller.js';

const authRouter = express.Router();

authRouter.post('/register', registerController);

authRouter.post('/login', loginController);

authRouter.post('/refresh', refreshAccessToken);

authRouter.post('/logout', logoutController)

export default authRouter;
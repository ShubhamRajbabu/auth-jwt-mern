import express from 'express';
import { loginController, logoutController, refreshAccessTokenController, registerController } from '../controllers/auth.controller.js';

const authRouter = express.Router();

authRouter.post('/register', registerController);

authRouter.post('/login', loginController);

authRouter.post('/refresh', refreshAccessTokenController);

authRouter.post('/logout', logoutController)

export default authRouter;
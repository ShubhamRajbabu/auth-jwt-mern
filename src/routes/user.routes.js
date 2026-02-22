import express from 'express';
import authMiddleware from '../middlewares/auth.middleware.js';
import { userController } from '../controllers/user.controller.js';

const userRouter = express.Router();

userRouter.get('/profile', authMiddleware, userController.getUserProfile);

export default userRouter;
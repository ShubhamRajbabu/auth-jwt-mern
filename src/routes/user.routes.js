import express from 'express';
import userController from '../controllers/user.controller.js';
import authMiddleware from '../middlewares/auth.middleware.js';

const userRouter = express.Router();

userRouter.get('/profile', authMiddleware, userController);

export default userRouter;
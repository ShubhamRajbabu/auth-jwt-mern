import express from 'express';
import cors from 'cors';
import authRouter from './routes/auth.routes.js';
import cookieParser from 'cookie-parser';
import userRouter from './routes/user.routes.js';
import errorMiddleware from './middlewares/error.middleware.js';

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors());

app.use('/api/auth', authRouter);
app.use('/api/user', userRouter);

app.use(errorMiddleware);
export default app;
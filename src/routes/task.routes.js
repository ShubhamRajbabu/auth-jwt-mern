import express from 'express';
import { taskController } from '../controllers/task.controller.js';

const taskRouter = express.Router();

taskRouter.get('/getAllTasks', taskController.getAllTasks);

export default taskRouter;
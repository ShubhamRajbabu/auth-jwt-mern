import express from 'express';
import { taskController } from '../controllers/task.controller.js';
import { roleMiddleware } from '../middlewares/role.middleware.js';
import authMiddleware from '../middlewares/auth.middleware.js';

const taskRouter = express.Router();

taskRouter.get('/getAllTasksByUserId', authMiddleware, taskController.getAllTasks);
taskRouter.get('/getTaskById/:taskId', authMiddleware, taskController.getTaskById);
taskRouter.post('/createTask', authMiddleware, taskController.createTask);
taskRouter.put('/updateTask/:taskId', authMiddleware, taskController.updateTasksById);
taskRouter.delete('/deleteTaskById/:taskId', authMiddleware, taskController.deleteTaskById);
taskRouter.delete('/deleteAllTasksForUser', authMiddleware, taskController.deleteAllTasksForUser);
//admin routes
taskRouter.get('/admin/getAllAdminTasks', authMiddleware, roleMiddleware('admin'), taskController.getAllAdminTasks);
taskRouter.get('/admin/getAdminTaskByTaskId/:taskId', authMiddleware, roleMiddleware('admin'), taskController.getAdminTaskByTaskId);
taskRouter.put('/admin/updateAdminTaskByTaskId/:taskId', authMiddleware, roleMiddleware('admin'), taskController.updateAdminTaskByTaskId);
taskRouter.delete('/admin/deleteAdminTaskByTaskId/:taskId', authMiddleware, roleMiddleware('admin'), taskController.deleteAdminTaskByTaskId);
taskRouter.delete('/admin/deleteAllAdminTasks', authMiddleware, roleMiddleware('admin'), taskController.deleteAllAdminTasks);
export default taskRouter;
import { taskServices } from "../services/task.services.js";

const getAllTasks = async (req, res, next) => {
    const userDetails = req.user;
    try {
        const tasks = await taskServices.getAllTasksByUserId(userDetails.id);
        return res.status(200).json({ tasks });
    } catch (error) {
        next(error);
    }
};

const getTaskById = async (req, res, next) => {
    const userDetails = req.user;
    const { taskId } = req.params;
    try {
        const task = await taskServices.getTaskById(taskId, userDetails.id);
        return res.status(200).json({ task });
    } catch (error) {
        next(error);
    }
};

const createTask = async (req, res, next) => {
    const { title, description } = req.body;
    const userId = req.user.id;
    try {
        const newTask = await taskServices.createTask(title, description, userId);
        return res.status(201).json({ task: newTask });
    } catch (error) {
        next(error);
    }
};

const updateTasksById = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const { taskId } = req.params;
        const updateData = req.body;
        const updatedTask = await taskServices.updateTask(taskId, userId, updateData);
        return res.status(200).json({ task: updatedTask });
    } catch (error) {
        next(error);
    }
};

const deleteTaskById = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const { taskId } = req.params;
        await taskServices.deleteTaskById(taskId, userId);
        return res.status(204).send();
    } catch (error) {
        next(error);
    }
}

const deleteAllTasksForUser = async (req, res, next) => {
    try {
        const userId = req.user.id;
        await taskServices.deleteAllTasksForUser(userId);
        return res.status(204).send();
    } catch (error) {
        next(error);
    }
}

//admin task controllers

const getAllAdminTasks = async (req, res, next) => {
    try {
        const tasks = await taskServices.getAllAdminTasks();
        return res.status(200).json({ tasks });
    } catch (error) {
        next(error);
    }
}

const getAdminTaskByTaskId = async (req, res, next) => {
    try {
        const { taskId } = req.params;
        const task = await taskServices.getAdminTaskByTaskId(taskId);
        return res.status(200).json({ task });
    } catch (error) {
        next(error);
    }
}

const updateAdminTaskByTaskId = async (req, res, next) => {
    try {
        const { taskId } = req.params;
        const updateData = req.body;
        const updatedTask = await taskServices.updateAdminTaskByTaskId(taskId, updateData);
        return res.status(200).json({ task: updatedTask });
    } catch (error) {
        next(error);
    }
}

const deleteAdminTaskByTaskId = async (req, res, next) => {
    try {
        const { taskId } = req.params;
        await taskServices.deleteAdminTaskByTaskId(taskId);
        return res.status(204).send();
    } catch (error) {
        next(error);
    }
}

const deleteAllAdminTasks = async (req, res, next) => {
    try {
        await taskServices.deleteAllAdminTasks();
        return res.status(204).send();
    } catch (error) {
        next(error);
    }
}

export const taskController = {
    getAllTasks, getTaskById, createTask,
    updateTasksById, deleteTaskById, deleteAllTasksForUser,
    getAllAdminTasks, getAdminTaskByTaskId, updateAdminTaskByTaskId,
    deleteAdminTaskByTaskId, deleteAllAdminTasks
};
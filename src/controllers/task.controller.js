import { taskServices } from "../services/task.services.js";
import logger from "../utils/logger.util.js";


const buildFilters = (req) => {
    return {
        pageNumber: parseInt(req.query.page) || 1,
        limit: parseInt(req.query.limit) || 5,
        completed:
            req.query.completed === undefined
                ? undefined
                : req.query.completed.toLowerCase() === "true",
        sortOrder: req.query.createdAt === "asc" ? 1 : -1
    };
};


const getAllTasks = async (req, res, next) => {
    const filters = buildFilters(req);
    try {
        const tasks = await taskServices.getAllTasksByUserId(req.user.id, filters);
        logger.info("User fetched tasks", {
            userId: req.user.id,
            page: filters.pageNumber
        });

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
        logger.info("Task created", {
            userId: req.user.id,
            taskId: newTask._id
        });
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

        logger.info("Task updated", {
            userId: req.user.id,
            taskId: updatedTask._id
        });

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
        logger.info("Task deleted", {
            userId: req.user.id,
            taskId: req.params.taskId
        });
        return res.status(204).send();
    } catch (error) {
        next(error);
    }
}

const deleteAllTasksForUser = async (req, res, next) => {
    try {
        const userId = req.user.id;
        await taskServices.deleteAllTasksForUser(userId);
        logger.warn("All tasks deleted by user", {
            userId: req.user.id
        });
        return res.status(204).send();
    } catch (error) {
        next(error);
    }
}

//admin task controllers

const getAllAdminTasks = async (req, res, next) => {
    const filters = buildFilters(req);
    try {
        const tasks = await taskServices.getAllAdminTasks(filters);
        logger.info("Admin fetched all tasks", {
            adminId: req.user.id
        });
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

        logger.warn("Admin updated task", {
            adminId: req.user.id,
            taskId: updatedTask._id
        });

        return res.status(200).json({ task: updatedTask });
    } catch (error) {
        next(error);
    }
}

const deleteAdminTaskByTaskId = async (req, res, next) => {
    try {
        const { taskId } = req.params;
        await taskServices.deleteAdminTaskByTaskId(taskId);
        logger.warn("Admin deleted task", {
            adminId: req.user.id,
            taskId: req.params.taskId
        });
        return res.status(204).send();
    } catch (error) {
        next(error);
    }
}

const deleteAllAdminTasks = async (req, res, next) => {
    try {
        await taskServices.deleteAllAdminTasks();
        logger.error("Admin deleted ALL tasks in system", {
            adminId: req.user.id
        });
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
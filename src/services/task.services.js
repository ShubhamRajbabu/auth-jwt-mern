import mongoose, { get } from "mongoose";
import { taskRepository } from "../repositories/task.repository.js";
import { createError } from "../utils/error.util.js";

const getAllTasksByUserId = async (userId) => {
    if (!userId) {
        throw createError("User not authorized", 401);
    }
    return await taskRepository.getAllTasksByUserId(userId);
}

const getTaskById = async (taskId, userId) => {
    if (!userId) {
        throw createError("User not authorized", 401);
    }
    if (!taskId) {
        throw createError("Task ID is required", 400);
    }
    if (mongoose.Types.ObjectId.isValid(taskId) === false) {
        throw createError("Invalid Task ID", 400);
    }

    const tasks = await taskRepository.getTaskById(taskId, userId);
    if (!tasks) {
        throw createError("Task not found", 404);
    }
    return tasks;
}

const createTask = async (title, description, userId) => {
    if (!title || !description) {
        throw createError("Please provide all details for creating tasks", 400);
    }
    const newTask = await taskRepository.createTask({ title, description, userId });
    if (!newTask) {
        throw createError("Failed to create task", 500);
    }
    return newTask;
}

const updateTask = async (taskId, userId, updateData) => {
    if (!userId) {
        throw createError("User not authorized", 401);
    }
    if (!taskId) {
        throw createError("Task ID is required", 400);
    }
    if (mongoose.Types.ObjectId.isValid(taskId) === false) {
        throw createError("Invalid Task ID", 400);
    }
    if (!updateData || Object.keys(updateData).length === 0) {
        throw createError("Please provide details to update the task", 400);
    }

    const updatedTask = await taskRepository.updateTask(taskId, userId, updateData);
    if (!updatedTask) {
        throw createError("Task not found or user not authorized to update this task", 404);
    }
    return updatedTask;
}

const deleteTaskById = async (taskId, userId) => {
    if (!userId) {
        throw createError("User not authorized", 401);
    }
    if (!taskId) {
        throw createError("Task ID is required", 400);
    }
    if (mongoose.Types.ObjectId.isValid(taskId) === false) {
        throw createError("Invalid Task ID", 400);
    }
    return await taskRepository.deleteTaskById(taskId, userId);
}

const deleteAllTasksForUser = async (userId) => {
    if (!userId) {
        throw createError("User not authorized", 401);
    }
    return await taskRepository.deleteAllTasksForUser(userId);
}

//admin tasks api's

const getAllAdminTasks = async () => {
    return await taskRepository.getAllAdminTasks();
}

const getAdminTaskByTaskId = async (taskId) => {
    if (!taskId) {
        throw createError("Task ID is required", 400);
    }
    if (mongoose.Types.ObjectId.isValid(taskId) === false) {
        throw createError("Invalid Task ID", 400);
    }
    return await taskRepository.getTaskByTaskId(taskId);
}

const updateAdminTaskByTaskId = async (taskId, updateData) => {
    if (!taskId) {
        throw createError("Task ID is required", 400);
    }
    if (mongoose.Types.ObjectId.isValid(taskId) === false) {
        throw createError("Invalid Task ID", 400);
    }
    const updatedTask = await taskRepository.updateTaskByTaskId(taskId, updateData);
    if (!updatedTask) {
        throw createError("Failed to update task", 500);
    }
    return updatedTask;
}

const deleteAdminTaskByTaskId = async (taskId) => {
    if (!taskId) {
        throw createError("Task ID is required", 400);
    }
    if (mongoose.Types.ObjectId.isValid(taskId) === false) {
        throw createError("Invalid Task ID", 400);
    }
    return await taskRepository.deleteTaskByTaskId(taskId);
}

const deleteAllAdminTasks = async () => {
    return await taskRepository.deleteAllTasks();
}

export const taskServices = {
    getAllTasksByUserId,
    getTaskById,
    createTask,
    updateTask,
    deleteTaskById,
    deleteAllTasksForUser,
    getAllAdminTasks,
    getAdminTaskByTaskId,
    updateAdminTaskByTaskId,
    deleteAdminTaskByTaskId,
    deleteAllAdminTasks
}
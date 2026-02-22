import Task from "../models/task.model.js"

const getAllTasksByUserId = async (userId) => {
    return await Task.find({ userId });
};

const getTaskById = async (taskId, userId) => {
    return await Task.findOne({ _id: taskId, userId });
};

const createTask = async (taskData) => {
    return await Task.create(taskData);
};

const updateTask = async (taskId, userId, updateData) => {
    return await Task.findOneAndUpdate({ _id: taskId, userId }, updateData, { new: true });
};

const deleteTaskById = async (taskId, userId) => {
    return await Task.findOneAndDelete({ _id: taskId, userId });
}

const deleteAllTasksForUser = async (userId) => {
    return await Task.deleteMany({ userId });
}

const getAllTasks = async () => {
    return await Task.find({});
};

const getTaskByTaskId = async (taskId) => {
    return await Task.findById(taskId);
};

const updateTaskByTaskId = async (taskId, updateData) => {
    return await Task.findByIdAndUpdate(taskId, updateData, { new: true });
};

const deleteTaskByTaskId = async (taskId) => {
    return await Task.findByIdAndDelete(taskId);
}

const deleteAllTasks = async () => {
    return await Task.deleteMany({});
}

export const taskRepository =
{
    getAllTasks, getAllTasksByUserId, getTaskById,
    createTask, updateTask, deleteTaskById,
    deleteAllTasks, getTaskByTaskId, updateTaskByTaskId,
    deleteTaskByTaskId, deleteAllTasksForUser
};
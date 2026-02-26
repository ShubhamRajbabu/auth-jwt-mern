import User from "../models/user.model.js";

const getUserByEmail = async (email) => {
    return await User.findOne({ email });
}

const getUserById = async (userId) => {
    return await User.findById(userId).select("-password");
}

const createUser = async (username, email, password, avatarUrl) => {
    return await User.create({
        username, email, password, avatarUrl
    })
}

export const userRepository = { getUserByEmail, createUser, getUserById };
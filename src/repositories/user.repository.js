import User from "../models/user.model.js";

const getUserByEmail = async (email) => {
    return await User.findOne({ email });
}

const createUser = async (username, email, password) => {
    return await User.create({
        username, email, password
    })
}

export { getUserByEmail, createUser };
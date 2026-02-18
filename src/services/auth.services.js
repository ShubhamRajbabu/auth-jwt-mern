
import bcrypt from "bcryptjs";
import { createUser, getUserByEmail } from "../repositories/user.repository.js";
import { createToken } from "../repositories/token.repository.js";
import { createError } from "../utils/error.util.js";
import { generateTokens } from "./token.service.js";

const registerService = async (username, email, password) => {

    if (!username || !email || !password) {
        throw createError("All fields are required", 400);
    }

    const isUserExist = await getUserByEmail(email);
    if (isUserExist) {
        throw createError("User already exists", 400);
    }

    const hashPassword = await bcrypt.hash(password, 10);

    const newUser = await createUser(username, email, hashPassword);

    const { accessToken, refreshToken } = generateTokens(newUser._id);

    await createToken(newUser._id, refreshToken);

    return { newUser, accessToken, refreshToken };
}

export { registerService };
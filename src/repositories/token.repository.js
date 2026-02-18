import Token from "../models/tokens.model.js";

const createToken = async (userId, refreshToken) => {
    return await Token.create({
        userId: userId,
        token: refreshToken
    });
}

export { createToken };
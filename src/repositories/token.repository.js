import Token from "../models/tokens.model.js";

const createToken = async (userId, refreshToken) => {
    return await Token.create({
        userId: userId,
        token: refreshToken
    });
}

const deleteTokenByUserId = async (userId) => {
    return await Token.deleteOne({ userId: userId });
}

const deleteToken = async (token) => {
    return await Token.deleteOne({ token: token });
}

const getTokenFromDB = async (token) => {
    return await Token.findOne({ token });
}


export const tokenRepository = { createToken, deleteTokenByUserId, deleteToken, getTokenFromDB };
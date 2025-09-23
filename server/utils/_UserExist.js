const joi = require("joi");
const getUserById = require("../dao/getUserById.dao");
const getUserByUsername = require("../dao/getUserByUsername.dao");


const idUserSchema = joi.object({
    userId: joi.number().integer().positive().required()
});

const userIdValid = (userId) => {
    // get a boolean if the userId is valid
    try {
        const { error } = idUserSchema.validate({ userId });
        return { valid: true, message: "test done", value: !error };
    } catch (error) {
        return { valid: false, message: error.message, value: null };
    }
}

const idUserExist = async (userId) => {
    try {
        const valid = userIdValid(userId);
        if (!valid.valid) return { valid: false, message: valid.message, value: null };
        if (!valid.value) return { valid: false, message: "user id is not valid", value: null };

        const user = await getUserById(userId);
        if (!user.valid) return { valid: false, message: user.message, value: null };
        if (!user.value) return { valid: false, message: "user not found", value: null };
        return { valid: true, message: "user found", value: user.value };
    } catch (error) {
        return { valid: false, message: error.message, value: null };
    }
}


const usernameSchema = joi.object({
    username: joi.string().alphanum().min(3).max(255).required()
});

const usernameValid = async (username) => {
    try {
        const { error } = usernameSchema.validate({ username });
        return { valid: true, message: "test done", value: !error };
    } catch (error) {
        return { valid: false, message: error.message, value: null };
    }
}


const usernameExist = async (username) => {
    try {
        const valid = await usernameValid(username);
        if (!valid.valid) return { valid: false, message: valid.message, value: false };
        if (!valid.value) return { valid: true, message: "username is not valid", value: false };
        const user = await getUserByUsername(username);
        if (!user.valid) return { valid: false, message: user.message, value: false };
        if (!user.value) return { valid: true, message: "user not found", value: false };
        return { valid: true, message: "user found", value: user.value };
    } catch (error) {
        return { valid: false, message: error.message, value: false };
    }
}

module.exports = {
    idUserExist,
    usernameExist
};

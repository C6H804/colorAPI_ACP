const verifyUserSchema = require("../schemas/verifyUser.schema");

const Hash = require("../utils/_Hash");
const addUserDao = require("../dao/addUser.dao");

const CreateToken = require("../utils/_CreateToken");
const getUserByUsername = require("../dao/getUserByUsername.dao");

const registerController = async (req) => {

    if (!req.body.addUserPassword || req.body.addUserPassword !== process.env.ADD_USER_PASSWORD) return { message: "Unauthorized", status: 401 };

    const userData = await verifyUserSchema(req.body);
    if (!userData.valid) return { message: userData.message, status: userData.status };

    const existingUser = await getUserByUsername(userData.value.username);
    if (existingUser.status !== 404) return { message: existingUser.status == 200 ? "user already exists" : existingUser.message, status: existingUser.status == 200 ? 409 : 500 };

    const hashedPassword = await Hash(userData.value.password);
    if (!hashedPassword.valid) return { message: hashedPassword.message, status: hashedPassword.status };

    const addUserResult = await addUserDao(userData.value.username, hashedPassword.value, userData.value.description);
    if (!addUserResult.valid) return { message: addUserResult.message, status: addUserResult.status };

    const user = await getUserByUsername(userData.value.username);
    if (!user.valid) return { message: user.message, status: user.status };
    const userId = user.value.id;

    const token = await CreateToken({ username: userData.value.username, id: userId });
    if (!token.valid) return { message: token.message, status: token.status };

    return { valid: true, message: "user registered successfully", status: 201, value: { token: token.value } };
}


module.exports = registerController;
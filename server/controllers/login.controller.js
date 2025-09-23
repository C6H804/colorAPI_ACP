
const verifyUserSchema = require("../schemas/verifyUser.schema");
const getUserByUsername = require("../dao/getUserByUsername.dao");
const CompareHash = require("../utils/_CompareHash");
const CreateToken = require("../utils/_CreateToken");
const UserExist = require("../utils/_UserExist").usernameExist;


const loginController = async(req) => {
    const userData = await verifyUserSchema(req.body);
    if (!userData.valid) return { message: userData.message, status: userData.status };

    const userExist = await UserExist(userData.value.username);
    if (!userExist.valid) return { message: userExist.message, status: userExist.status };
    if (!userExist.value) return { message: "user not found", status: 404 };

    const user = await getUserByUsername(userData.value.username);
    if (!user.valid) return { message: user.message, status: user.status };

    const compare = await CompareHash(userData.value.password, user.value.password);
    if (!compare.valid) return { message: compare.message, status: compare.status };
    if (!compare.value) return { message: "invalid password", status: 401 };

    const payload = { id: user.value.id, username: user.value.username };

    const token = await CreateToken(payload);
    if (!token.valid) return { message: token.message, status: token.status };

    return { valid: true, message: "login successful", status: 200, value: token.value };
};

module.exports = loginController;
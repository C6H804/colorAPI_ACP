const verifyUserSchema = require("../schemas/verifyUser.schema");

const Hash = require("../utils/_Hash");
const addUserDao = require("../dao/addUser.dao");

const CreateToken = require("../utils/_CreateToken");
const getUserByUsername = require("../dao/getUserByUsername.dao");
const UserExist = require("../utils/_UserExist").usernameExist;
const grantPermission = require("../dao/permissions.dao").grantPermission;


const registerController = async (req) => {
    const userData = await verifyUserSchema(req.body);
    if (!userData.valid) return { valid: false, message: userData.message, status: 400 };

    const userExist = await UserExist(userData.value.username);
    if (userExist.value) return { valid: false, message: "username already exists", status: 409}

    const hashedPassword = await Hash(userData.value.password);
    if (!hashedPassword.valid) return { valid: false, message: hashedPassword.message, status: hashedPassword.status };

    const addUserResult = await addUserDao(userData.value.username, hashedPassword.value, userData.value.description);
    if (!addUserResult.valid) return { message: addUserResult.message, status: addUserResult.status };

    const user = await getUserByUsername(userData.value.username);
    if (!user.valid) return { message: user.message, status: user.status };
    const userId = user.value.id;

    const token = await CreateToken({ username: userData.value.username, id: userId });
    if (!token.valid) return { message: token.message, status: token.status };


    const grant = await grantPermission(userId, 1); // 1 is the id of the "visitor" permission
    if (!grant.valid) return { valid: false, message: grant.message, status: grant.status };

    return { valid: true, message: "user registered successfully", status: 201, value: { token: token.value } };
}


module.exports = registerController;
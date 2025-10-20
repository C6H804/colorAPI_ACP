
const verifyUserSchema = require("../schemas/verifyUser.schema");
const getUserByUsername = require("../dao/getUserByUsername.dao");
const CompareHash = require("../utils/_CompareHash");
const CreateToken = require("../utils/_CreateToken");
const UserExist = require("../utils/_UserExist").usernameExist;
const updateLastConnexion = require("../dao/updateLastConnexion.dao");
const verifyPermissions = require("../utils/_VerifyPermissions");
const { valid } = require("joi");


const loginController = async(req) => {
    const userData = await verifyUserSchema(req.body);
    if (!userData.valid) return { message: userData.message, status: userData.status };

    const userExist = await UserExist(userData.value.username);
    if (!userExist.valid) return { message: userExist.message, status: userExist.status, valid: false };
    if (!userExist.value) return { message: "user not found", status: 404, valid: false };

    const user = await getUserByUsername(userData.value.username);
    if (!user.valid) return { message: user.message, status: user.status, valid: false };
    if (user.value.deleted) return { message: "user not found", status: 404, valid: false };

    const compare = await CompareHash(userData.value.password, user.value.password);
    if (!compare.valid) return { message: compare.message, status: compare.status, valid: false };
    if (!compare.value) return { message: "invalid password", status: 401, valid: false };

    const payload = { id: user.value.id, username: user.value.username };

    const isPermanent = await verifyPermissions(user, ["permanent"])


    const token = await CreateToken(payload, isPermanent.valid);
    if (!token.valid) return { message: "server error", status: 500, valid: false };

    // update last_connection
    const updateLastConnexionResult = await updateLastConnexion(user.value.id);
    if (!updateLastConnexionResult.valid) console.error("Failed to update last connection:", updateLastConnexionResult.message);

    return { valid: true, message: "login successful", status: 200, value: token.value };
};

module.exports = loginController;
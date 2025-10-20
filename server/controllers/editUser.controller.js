const joi = require("joi");


const getUserById = require("../dao/getUserById.dao");
const verifyNewPermissions = require("../schemas/verifyNewPermissions.schema");
const getPermissionsList = require("../dao/permissions.dao").getPermissionsList;

const revokePermission = require("../dao/permissions.dao").revokePermission;
const grantPermission = require("../dao/permissions.dao").grantPermission;

const updateUsername = require("../dao/updateUser.dao").updateUsername;
const updateDescription = require("../dao/updateUser.dao").updateDescription;

const Hash = require("../utils/_Hash");
const changePassword = require("../dao/changePassword.dao");
const verifyPermissions = require("../utils/_VerifyPermissions");


const adminOnly = async (req, res) => {
    const verify = await verifyPermissions(req.user, ["admin"]);
    if (!verify.valid) return res.status(verify.status).json({ message: verify.message });
    return { valid: true, message: "Authorized", status: 200, value: null };
};

const editUser = async (req) => {
    const id = parseInt(req.params.id, 10);
    if (!req.body || Object.keys(req.body).length === 0) return { message: "No data provided", status: 400, valid: false };


    // verify if user exists
    const userCheck = await getUserById(id);
    if (!userCheck.valid) return { message: userCheck.message, status: userCheck.status, valid: false };
    const user = userCheck.value;



    if (user.id === 1 && req.user.value.id !== 1) return { message: "Vous n'avez pas la permissions pour modifier cet utilisateur", status: 403, valid: false };


    const userInfo = { username: req.body.username, description: req.body.description, permissions: req.body.permissions };
    const newPerms = await verifyNewPermissions(userInfo);
    if (!newPerms.valid) return { message: newPerms.message, status: newPerms.status, valid: false };


    const allPermissions = await getPermissionsList();
    if (!allPermissions.valid) return { message: allPermissions.message, status: allPermissions.status, valid: false };



    allPermissions.value.forEach(async e => {
        if (e.name !== "admin") {
            const revoke = await revokePermission(user.id, e.id);
            if (!revoke.valid && revoke.status !== 404) console.error("Error revoking permission:", revoke.message);
        }
        if (e.name !== "admin" && userInfo.permissions[e.id] === true) {
            const grant = await grantPermission(user.id, e.id);
            if (!grant.valid) console.error("Error granting permission:", grant.message);
        }
    });

    // change the username
    const newUsername = await updateUsername(user.id, userInfo.username);
    if (!newUsername.valid) return { message: newUsername.message, status: newUsername.status, valid: false };

    // change the description
    const newDescription = await updateDescription(user.id, userInfo.description);
    if (!newDescription.valid) return { message: newDescription.message, status: newDescription.status, valid: false };

    // change the password
    if (typeof req.body.password !== "string") return { message: "Password must be a string", status: 400, valid: false };

    if (req.body.password !== "") {
        const passwordSchema = joi.string().min(10).max(50).pattern(new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9]).{10,50}$")).required();
        const { error } = passwordSchema.validate(req.body.password);
        if (error) return { message: "le mot de passe doit être compris entre 10 et 50 caractères et contenir au moins une lettre minuscule, majuscule et un chiffre", status: 400, valid: false };
        const hashedPassword = await Hash(req.body.password);
        if (!hashedPassword.valid) return { message: "Error hashing password", status: 500, valid: false };
        const passwordChange = await changePassword(user.id, hashedPassword.value);
        if (!passwordChange.valid) return { message: passwordChange.message, status: passwordChange.status, valid: false };
    }

    return { message: "User permissions updated successfully", status: 200, valid: true };

}


module.exports = editUser;
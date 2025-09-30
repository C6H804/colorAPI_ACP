const getUserById = require("../dao/getUserById.dao");
const verifyNewPermissions = require("../schemas/verifyNewPermissions.schema");
const getPermissionsList = require("../dao/permissions.dao").getPermissionsList;

const revokePermission = require("../dao/permissions.dao").deletePermission;
const grantPermission = require("../dao/permissions.dao").grantPermission;

const editUser = async (req) => {
    const id = parseInt(req.params.id, 10);
    if (!req.body || Object.keys(req.body).length === 0) return { message: "No data provided", status: 400, valid: false };

    // verify if user exists
    const userCheck = await getUserById(id);
    if (!userCheck.valid) return { message: userCheck.message, status: userCheck.status, valid: false };
    const user = userCheck.value;

    const userInfo = { username: req.body.username, description: req.body.description, permissions: req.body.permissions }
    const newPerms = await verifyNewPermissions(userInfo);
    if (!newPerms.valid) return { message: newPerms.message, status: newPerms.status, valid: false };


    const allPermissions = await getPermissionsList();
    if (!allPermissions.valid) return { message: allPermissions.message, status: allPermissions.status, valid: false };

    allPermissions.value.forEach(async e => {
        if (e.name !== "admin") {
            // remove the permission 
            // delete from users_permissions where id_user = user.id and id_permission = e.id
            const revoke = await revokePermission(user.id, e.id);
            if (!revoke.valid && revoke.status !== 404) console.error("Error revoking permission:", revoke.message);
        }
        if (e.name !== "admin" && userInfo.permissions[e.id] === true) {
            // add the permission to the user
            // insert into users_permissions (id_user, id_permission) values (user.id, e.id)
            const grant = await grantPermission(user.id, e.id);
            if (!grant.valid) console.error("Error granting permission:", grant.message);
        }

    });

    return { message: "User permissions updated successfully", status: 200, valid: true };

}


module.exports = editUser;
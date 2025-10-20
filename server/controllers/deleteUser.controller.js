const getUserById = require("../dao/getUserById.dao"); 
const isUserAdmin = require("../dao/isUserAdmin.dao");
const deleteUserDao = require("../dao/deleteUser.dao").deleteUser;
const deletePermissions = require("../dao/deleteUser.dao").deletePermissions;

const deleteUser = async (req, userId) => {

    // verify if user exists,
    const user = await getUserById(userId);
    if (!user) return { valid: false, message: "User not found", status: 404 };

    // verify if user is not admin (cannot delete admin)
    const isAdmin = await isUserAdmin(userId);
    if (!isAdmin.valid) return { valid: false, message: isAdmin.message, status: isAdmin.status };
    if (isAdmin.value) return { valid: false, message: "impossible de supprimer utilisateur admin", status: 403 };

    // delete user from user_permissions
    const deletePermissionsResult = await deletePermissions(userId);
    if (!deletePermissionsResult.valid) return { valid: false, message: deletePermissionsResult.message, status: deletePermissionsResult.status };

    // add delete value in users table
    const deleteResult = await deleteUserDao(userId);
    if (!deleteResult.valid) return { valid: false, message: deleteResult.message, status: deleteResult.status };

    return { valid: true, message: "user deleted successfully", status: 201 };
}

module.exports = deleteUser;
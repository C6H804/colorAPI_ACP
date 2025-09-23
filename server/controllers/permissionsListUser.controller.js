const getUserUserPermissions = require("../dao/permissions.dao").getUserUserPermissions;

const permissionUsers = async (req) => {
    if (!req.params.id) return { status: 400, message: "user ID is required" };
    if (isNaN(parseInt(req.params.id, 10))) return { status: 400, message: "user ID must be a number" };
    const userId = parseInt(req.params.id, 10);
    
    const list = await getUserUserPermissions(userId);
    if (!list.valid) return { status: 500, message: "Internal Server Error" };
    return { valid: true, message: "list fetched successfully", value: list.value, status: 200 };
}

module.exports = permissionUsers;
const permissionList = require("../dao/permissions.dao").getPermissionsList;


const CpermissionList = async (req) => {
    const list  = await permissionList();
    if (!list.valid) return { status: 500, message: "Internal Server Error" };
    return { valid: true, message: "list fetched successfully", value: list.value, status: 200 };
}

module.exports = CpermissionList;
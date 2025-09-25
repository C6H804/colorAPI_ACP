const getUsersPermissions = require("../dao/getUserPermissions.dao")

const verifyPermissions = async (user, requiredPermissions) => {
    const userId = user.value.id;
    const userPermissions = await getUsersPermissions(userId);
    
    if (!userPermissions.valid) return { valid: false, message: "could not retrieve user permissions", status: 500 };

    let result = { valid: false, message: "user lacks required permissions", status: 403 };
    requiredPermissions.forEach(e => {
        userPermissions.value.forEach(p => {
            if (e === p.name) result = { valid: true, message: "user has required permissions", status: 200 };
        });
    });

    return result;
}

module.exports = verifyPermissions;
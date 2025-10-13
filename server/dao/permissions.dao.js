const mysql = require("mysql2");
const db = require("../config/db.connection.root");

const getPermissionsList = async () => {
    // Utilisation de l'utilisateur permissionsManager (gestion complète des permissions)
    const stmt = "SELECT * FROM permissions";
    try {
        const [results] = await db.execute(stmt);
        return { valid: true, value: results };
    } catch (error) {
        console.error("Database error:", error);
        return { valid: false, message: "error in getPermissionsList", status: 500 };
    } 
}

const createPermission = async (name, description) => {
    // Utilisation de l'utilisateur permissionsManager (gestion complète des permissions)
    const stmt = "INSERT INTO permissions (name, description) VALUES (?, ?)";
    const values = [name, description];
    try {
        const [results] = await db.execute(stmt, values);
        return { valid: true, value: results.insertId };
    } catch (error) {
        console.error("Database error:", error);
        return { valid: false, message: "error in createPermission", status: 500 };
    }
}

const deletePermission = async (id) => {
    // Utilisation de l'utilisateur permissionsManager (gestion complète des permissions)
    const stmt = "DELETE FROM permissions WHERE id = ?";
    const values = [id];
    try {
        const [results] = await db.execute(stmt, values);
        if (results.affectedRows === 0) return { valid: false, message: "permission not found", status: 404 };
        return { valid: true, message: "permission deleted successfully", status: 201 };
    } catch (error) {
        console.error("Database error:", error);
        return { valid: false, message: "error in deletePermission", status: 500 };
    }
}

// const modifyPermission = async (id, name, description) => {
//     const stmt = "UPDATE permissions SET name = ?, description = ? WHERE id = ?";
//     const values = [name, description, id];
//     try {
//         const [results] = await db.execute(stmt, values);
//         if (results.affectedRows === 0) return { valid: false, message: "permission not found", status: 404 };
//         return { valid: true, message: "permission updated successfully", status: 201 };
//     } catch (error) {
//         console.error("Database error:", error);
//         return { valid: false, message: "error in modifyPermission", status: 500 };
//     }
// }

const getUserUserPermissions = async (userId) => {
    // Utilisation de l'utilisateur permissionsManager (gestion complète des permissions)
    const stmt = "SELECT p.* FROM users_permissions up JOIN users u ON up.id_user = u.id JOIN permissions p ON up.id_permission = p.id WHERE u.id = ?";
    const values = [userId];
    try {
        const [results] = await db.execute(stmt, values);
        return { valid: true, value: results };
    } catch (error) {
        console.error("getUserUserPermission", error);
        return { valid: false, message: "error fetching user permissions", status: 500 };
    } 
}


const grantPermission = async (userId, permissionId) => {
    // Utilisation de l'utilisateur permissionsManager (gestion complète des permissions)
    const stmt = "INSERT INTO users_permissions (id_user, id_permission) VALUES (?, ?)";
    const values = [userId, permissionId];
    try {
        const [results] = await db.execute(stmt, values);
        return { valid: true, message: "permission granted", status: 201 };
    } catch (error) {
        console.error("grantPermission", error);
        return { valid: false, message: "error in grantPermission", status: 500 };
    } 
}

const revokePermission = async (userId, permissionId) => {
    // Utilisation de l'utilisateur permissionsManager (gestion complète des permissions)
    const stmt = "DELETE FROM users_permissions WHERE id_user = ? AND id_permission = ?";
    const values = [userId, permissionId];
    try {
        const [results] = await db.execute(stmt, values);
        if (results.affectedRows === 0) return { valid: false, message: "permission not found for user", status: 404 };
        return { valid: true, message: "permission revoked", status: 201 };
    } catch (error) {
        console.error("revokePermission", error);
        return { valid: false, message: "error in revokePermission", status: 500 };
    } 
}

module.exports = {
    getPermissionsList,
    createPermission,
    deletePermission,
    // modifyPermission,
    getUserUserPermissions,
    grantPermission,
    revokePermission
};
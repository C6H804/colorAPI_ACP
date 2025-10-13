const mysql = require("mysql2");
const db = require("../config/db.connection.root");

const updateUsername = async (userId, newUsername) => {
    // Utilisation de l'utilisateur userChanger (UPDATE/SELECT sur users pour username/description)
    const stmt = "UPDATE users SET username = ? WHERE id = ? AND deleted = 0";
    const values = [newUsername, userId];
    try {
        const [results] = await db.execute(stmt, values);
        if (results.affectedRows === 0)
            return { valid: false, message: "No user found with the given ID", status: 404 };
        return { valid: true, message: "Username updated successfully", status: 200 };
    } catch (error) {
        console.error("updateUsername error:", error);
        return { valid: false, message: "Database error", status: 500 };
    }
};

const updateDescription = async (userId, newDescription) => {
    // Utilisation de l'utilisateur userChanger (UPDATE/SELECT sur users pour username/description)
    const stmt = "UPDATE users SET description = ? WHERE id = ? AND deleted = 0";
    const values = [newDescription, userId];
    try {
        const [results] = await db.execute(stmt, values);
        if (results.affectedRows === 0)
            return { valid: false, message: "No user found with the given ID", status: 404 };
        return { valid: true, message: "Description updated successfully", status: 200 };
    } catch (error) {
        console.error("updateDescription error:", error);
        return { valid: false, message: "Database error", status: 500 };
    }
};

module.exports = { updateUsername, updateDescription };
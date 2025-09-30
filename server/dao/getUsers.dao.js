const mysql = require("mysql2");
const db = require("../config/db.connection.root");

const getUsers = async () => {
    try {
        const [results] = await db.execute("SELECT id, username, description, last_connection FROM users");
        return { valid: true, message: "Users retrieved successfully", status: 200, value: results };
    } catch (error) {
        console.error("Error retrieving users:", error);
        return { valid: false, message: "Error retrieving users", status: 500 };
    }
}

module.exports = getUsers;

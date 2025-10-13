const mysql = require("mysql2");
const db = require("../config/db.connection.root");

const addUser = async (username, hashedPassword, description = "aucune description") => {
    // Utilisation de l'utilisateur userAdder (INSERT sur users uniquement)
    const stmt = "INSERT INTO users (username, password, description) VALUES (?, ?, ?)";
    const values = [username, hashedPassword, description];
    try {
        const [result] = await db.execute(stmt, values);
        return { valid: true, message: "user added successfully", status: 201 };
    } catch (error) {
        if (error.code === "ER_DUP_ENTRY") {
            return { valid: false, message: "username already exists", status: 409 };
        }
        console.error("Database error:", error);
        return { valid: false, message: "database error", status: 500 };
    } 
};

module.exports = addUser;
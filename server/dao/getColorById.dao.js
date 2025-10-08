const mysql = "mysql2";
const connect = require("../config/db.connection.root");

const getColorById = async (id) => {
    const db = connect("colorReader");
    const stmt = "SELECT * FROM colors WHERE id = ?";
    const value = [id];
    try {
        const [results] = await db.promise().execute(stmt, value);
        return { status: 200, valid: true, message: "Color found", value: results[0] || null };
    } catch (error) {
        console.error("error in getColorById:", error);
        return { status: 500, valid: false, message: "Database error", error: error.message };
    }
}

module.exports = getColorById;
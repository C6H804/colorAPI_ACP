const mysql = require("mysql2");
const db = require("../config/db.connection.root");


const getColorList = async (order) => {
    const stmt = "SELECT * FROM colors ORDER BY ? ASC";
    const values = [order];
    console.log("Executing query:", stmt, values);
    try {
        const [results] = await db.execute(stmt, values);
        // const [results] = await db.execute("SELECT * FROM colors ORDER BY shiny_stock ASC");
        return { valid: true, data: results, status: 200 };
    } catch (error) {
        console.error("Database error:", error);
        return { valid: false, message: "Database error in getColorList", status: 500 };
    }
}

module.exports = getColorList;
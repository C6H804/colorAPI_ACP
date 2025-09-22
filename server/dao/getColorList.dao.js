const mysql = require("mysql2");
const db = require("../config/db.connection.root");


const getColorListFiltered = async (filter) => {
    const stmt = `SELECT * FROM colors WHERE ${filter} = 1 ORDER BY value DESC`;

    try {
        const [results] = await db.execute(stmt);
        return { valid: true, value: results, status: 200 };
    } catch (error) {
        console.error("getColorListFiltered error:", error);
        return { valid: false, message: "failed to get colors", status: 500 };
    }
}

const getColorList = async () => {
    const stmt = "SELECT * FROM colors ORDER BY value DESC";
    try {
        const [results] = await db.execute(stmt);
        return { valid: true, value: results, status: 200 };
    } catch (error) {
        console.error("getColorList error:", error);
        return { valid: false, message: "failed to get colors", status: 500 };
    }
}

module.exports = { getColorList, getColorListFiltered };
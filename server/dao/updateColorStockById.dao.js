const mysql = require("mysql2");
const db = require("../config/db.connection.root");

const updateColorStockById = async (id, shiny, matte, sanded) => {
    // Utilisation de l'utilisateur colorStockChanger (UPDATE/SELECT sur colors pour les stocks)
    const smt = "UPDATE colors SET shiny_stock = ?, matte_stock = ?, sanded_stock = ? WHERE id = ?";
    const values = [shiny, matte, sanded, id];

    try {
        const [results] = await db.execute(smt, values);
        return { valid: true, status: 200, message: "Color stock updated successfully", value: results };
    } catch (error) {
        console.error("updateColorStockById:", error);
        return { valid: false, status: 500, message: "Error updating color stock", error: error.message };
    }
}

module.exports = updateColorStockById;
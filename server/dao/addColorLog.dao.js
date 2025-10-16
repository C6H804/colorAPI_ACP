const mysql = require("mysql2");
const db = require("../config/db.connection.root");

const addColorLog = async (idU, idC, changeDescription, idColorChangeType) => {

    // console.log(idU + ' ' + idC  + ' ' +  changeDescription  + ' ' +  idColorChangeType); TEMP
    // Utilisation de l'utilisateur colorLogAdder (INSERT sur update_colors uniquement)
    const stmt = "INSERT INTO update_colors (id_user, id_color, change_description, id_color_change_types) VALUES (?, ?, ?, ?)";
    const values = [idU, idC, changeDescription, idColorChangeType];
    try {
        const [results] = await db.execute(stmt, values);
        return { valid: true, message: "log added", status: 201 };
    } catch(error) {
        console.error("error in addColorLog:", error);
        return { valid: false, message: "database error", status: 500 };
    }
};

module.exports = addColorLog;
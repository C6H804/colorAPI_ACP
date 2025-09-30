const getColorById = require("../dao/getColorById.dao");
const verifyColorStock = require("../schemas/verifyColorStock.schema");
const updateColorStockById = require("../dao/updateColorStockById.dao");
const addColorLog = require("../dao/addColorLog.dao");

const modifyColorStock = async (req) => {
    const idColor = req.params.id;
    if (!idColor || parseInt(idColor) <= 0 || isNaN(parseInt(idColor))) return { status: 400, valid: false, message: "Invalid color ID" };

    const color = await getColorById(idColor);
    if (!color.valid) return { valid: false, status: color.status, message: color.message };
    if (color.value.length === 0) return { valid: false, status: 404, message: "Color not found" };
    
    const verifyStock = await verifyColorStock(req.body);
    if (!verifyStock.valid) return { status: 400, valid: false, message: verifyStock.message };


    const oldStockMessage = `Brillant : ${color.value.shiny_stock}, Mat : ${color.value.matte_stock}, Sablé : ${color.value.sanded_stock}`;
    const newStockMessage = `Brillant : ${verifyStock.value.shiny_stock}, Mat : ${verifyStock.value.matte_stock}, Sablé : ${verifyStock.value.sanded_stock}`;
    const logMessage = `Stock modifié. Ancien stock - ${oldStockMessage}. Nouveau stock - ${newStockMessage}.`;


    const newStock = {
        shiny_stock: verifyStock.value.shiny_stock,
        matte_stock: verifyStock.value.matte_stock,
        sanded_stock: verifyStock.value.sanded_stock
    };



    const update = await updateColorStockById(idColor, newStock.shiny_stock, newStock.matte_stock, newStock.sanded_stock);
    if (!update.valid) return { valid: false, status: update.status, message: update.message };

    if (oldStockMessage != newStockMessage) {
        const log = await addColorLog(req.user.value.id, color.value.id, logMessage, 3);
        if (!log.valid) return { valid: false, status: log.status, message: log.message };
    }


    return { valid: true, status: 200, message: "Color stock updated successfully" };
}

module.exports = modifyColorStock;

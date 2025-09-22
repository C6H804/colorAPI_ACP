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

    const newStock = {
        shiny_stock: verifyStock.value.shiny_stock !== undefined ? verifyStock.value.shiny_stock : color.value[0].shiny_stock,
        matte_stock: verifyStock.value.matte_stock !== undefined ? verifyStock.value.matte_stock : color.value[0].matte_stock,
        sanded_stock: verifyStock.value.sanded_stock !== undefined ? verifyStock.value.sanded_stock : color.value[0].sanded_stock
    };

    const update = await updateColorStockById(idColor, newStock.shiny_stock, newStock.matte_stock, newStock.sanded_stock);
    if (!update.valid) return { valid: false, status: update.status, message: update.message };

    const logDescription = "changement de " + JSON.stringify(verifyStock.value).replace(/"/g, '').replace(/,/g, ' -').replace(/{|}/g, '') + " | en : " + JSON.stringify(newStock).replace(/"/g, '').replace(/,/g, ' -').replace(/{|}/g, '');

    const log = await addColorLog(req.user.value.id, color.value.id, logDescription, 3);
    if (!log.valid) return { valid: false, status: log.status, message: log.message };

    return { valid: true, status: 200, message: "Color stock updated successfully" };
}

module.exports = modifyColorStock;

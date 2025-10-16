const addColorLog = require("../dao/addColorLog.dao");
const getColorById = require("../dao/getColorById.dao");
const deleteColor = require("../dao/deleteColor.dao");

const deleteColorController = async (req) => {
    if (!req.params.id) return res.status(400).json({ message: "id required", valid: false });
    if (isNaN(req.params.id)) return res.status(400).json({ message: "id must be a number", valid: false });
    if (req.params.id <= 0) return res.status(400).json({ message: "id must be greater than 0", valid: false });
    if (req.params.id % 1 !== 0) return res.status(400).json({ message: "id must be an integer", valid: false });


    const colorById = (await getColorById(req.params.id));
    if (!colorById.valid) return { valid: false, message: colorById.message, status: colorById.status ? colorById.status : 500 };

    const addColorLogResult = await addColorLog(req.user.value.id, colorById.value.id, "Suppression de la couleur " + colorById.value.name_fr + " | " + colorById.value.name_pt + " | " + colorById.value.name_en, 4);
    if (!addColorLogResult.valid) return { valid: false, message: addColorLogResult.message, status: addColorLogResult.status ? addColorLogResult.status : 500 };

    const result = await deleteColor(req.params.id);
    if (!result.valid) return { valid: false, message: result.message, status: result.status ? result.status : 500 };
    return { valid: true, message: result.message, status: 200 };
}

module.exports = deleteColorController;
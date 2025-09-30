const verifyFilters = require("../schemas/verifyFilters.schema");
const getColorListDao = require("../dao/getColorList.dao").getColorList;
const getColorListDaoFiltered = require("../dao/getColorList.dao").getColorListFiltered;
const getColorListAvailable = require("../dao/getColorList.dao").getColorListAvailable;

const getColorsController = async (filter) => {
    // console.log("Received filter:", filter);
    const filterResult = verifyFilters(filter);
    let colorList;
    if (!filterResult.valid) {
        if (filter === "no_stock") {
            colorList = await getColorListDao();
        } else {
            colorList = await getColorListAvailable();
        }
    } else {
        colorList = await getColorListDaoFiltered(filterResult.value);
    }

    if (!colorList.valid) return { valid: false, message: colorList.message, status: colorList.status };

    return { valid: true, colors: colorList.value, status: 200 };
}

module.exports = getColorsController;
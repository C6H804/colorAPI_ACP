getLastColorUpdate = require("../dao/getLastColorUpdate.dao");
const getLastModification = async () => {
    try {
        const result = await getLastColorUpdate();
        return result;
    } catch (error) {
        console.error("Error in getLastModification controller:", error);
        return { valid: false, message: "Internal server error", status: 500, value: null };
    }
};

module.exports = getLastModification;
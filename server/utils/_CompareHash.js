const bcrypt = require("bcrypt");

const CompareHash = async (input, hash) => {
    try {
        const result = await bcrypt.compare(input, hash);
        if (typeof result !== "boolean") return { valid: false, message: "invalid comparison result", status: 500 };
        return { valid: true, message: "hashes compared", status: 200, value: result };
    } catch (error) {
        console.error("Error comparing hashes:", error);
        return { valid: false, message: "error comparing hashes", status: 500 };
    }
};

module.exports = CompareHash;
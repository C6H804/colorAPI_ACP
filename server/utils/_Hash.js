const bcrypt = require("bcrypt");

const Hash = async (data) => {
    try {
        const saltRounds = process.env.BCRYPT_SALT_ROUNDS;
        const hashData = await bcrypt.hash(data, parseInt(saltRounds, 10));
        return { valid: true, value: hashData, message: "hashing successful", status: 200 };
    } catch (error) {
        return { valid: false, message: "hashing failed", status: 500 };
    }
}

module.exports = Hash;
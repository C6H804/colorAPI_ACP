const express = require("express");

const router = express.Router();

const registerController = require("../controllers/register.controller");


router.post("/register", async (req, res) => {
    const verify = await verifyPermissions(req.user, ["admin"]);
    if (!verify.valid) return res.status(verify.status).json({ message: verify.message });

    const result = await registerController(req);
    return res.status(result.status).json({ message: result.message, value: result.value });

});
module.exports = router;
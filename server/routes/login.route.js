const express = require("express");
const router = express.Router();


const loginController = require("../controllers/login.controller");


router.post("/login", async (req, res) => {
    const result = await loginController(req);
    if (!result.valid) return res.status(result.status).json({ valid:false, message: result.message, status: result.status });
    return res.status(result.status).json({ valid:true, message: result.message, status: result.status, value: result.value });
});



module.exports = router;
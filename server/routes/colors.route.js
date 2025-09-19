const express = require("express");
const router = express.Router();
const getColorList = require("../dao/getColorList.dao");

const auth = require("../middlewares/auth");
const { get } = require("express/lib/response");

router.use(auth);

router.post("/list", async (req, res) => {
    const listOrder = { matte: "matte_stock", shiny: "shiny_stock", sanded: "sanded_stock"};
    let order
    if (!req.body.order || typeof req.body.order !== "string") {
        order = "value";
    } else {
        if (!Object.keys(listOrder).includes(req.body.order)) {
            order = "value";
        } else {
            order = listOrder[req.body.order];
        }
    }
    
    const colorList = await getColorList(order);
    if (!colorList.valid) return res.status(colorList.status).json({ valid: false, message: colorList.message, status: colorList.status });
    return res.status(200).json({ valid: true, value: colorList.data, status: 200 });
});

module.exports = router;
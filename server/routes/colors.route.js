const express = require("express");
const router = express.Router();



const auth = require("../middlewares/auth");
const getColorsController = require("../controllers/colorsList.controller");
const verifyPermissions = require("../utils/_VerifyPermissions");
const modifyColorStock = require("../controllers/modifyColorStock.controller");
const addColor = require("../controllers/addColor.controller");
const deleteColor = require("../dao/deleteColor.dao");
const getLastModification = require("../controllers/getLastModification.controller");
const deleteColorController = require("../controllers/deleteColor.controller.js");

router.use(auth);

router.post("/list", async (req, res) => {
    // renvoie la liste des couleurs en fonction d'un filtre optionnel
    // demande un token JWT en header Authorization Bearer <token>
    // nécessite les permissions admin, visitor ou modify_colors
    // le filtre peut contenir les champs suivants :
    // - name : string (shiny_stockn, matte_stock, sanded_stock ou no_stock)

    const verify = await verifyPermissions(req.user, ["admin", "moderator", "visitor", "modify_colors"]);
    if (!verify.valid) return res.status(verify.status).json({ message: verify.message });
    // console.log("Filter received:", req.body.filter); // Debugging line


    const result = await getColorsController(req.body.filter);
    res.status(result.status).json(result);
});

router.get("/lastUpdate", async (req, res) => {
    // renvoie la date de la dernière modification de la table colors
    // demande un token JWT en header Authorization Bearer <token>
    // nécessite les permissions admin, visitor ou modify_colors

    const verify = await verifyPermissions(req.user, ["admin", "moderator", "visitor", "modify_colors"]);
    if (!verify.valid) return res.status(verify.status).json({ message: verify.message });

    const result = await getLastModification();
    return res.status(result.status).json({ message: result.message, valid: result.valid, value: result.value });

    }); 

router.post("/modifyStock/:id", async (req, res) => {
    // modifie le stock d'une couleur à partir de son id et du nouveau stock
    // demande un token JWT en header Authorization Bearer <token>
    // nécessite les permissions admin ou color manager
    
    const verify = await verifyPermissions(req.user, ["admin", "moderator", "color manager"]);
    if (!verify.valid) return res.status(verify.status).json({ message: verify.message });

    const result = await modifyColorStock(req);
    return res.status(result.status).json({ message: result.message, valid: result.valid });
});



const adminOnly = async (req, res) => {
    const verify = await verifyPermissions(req.user, ["admin", "moderator"]);
    if (!verify.valid) return res.status(verify.status).json({ message: verify.message });
    return { valid: true, message: "Authorized", status: 200, value: null };
};


router.post("/addColor", async (req, res) => {
    // ajoute une couleur à partir de name, value, color et des stocks shiny_stock, matte_stock, sanded_stock
    // demande un token JWT en header Authorization Bearer <token>
    // seulement les admin peuvent accéder à cette route

    const adminCheck = await adminOnly(req, res);
    if (!adminCheck.valid) return res.status(adminCheck.status).json({ message: adminCheck.message });

    const result = await addColor(req);
    if (!result.valid) return res.status(result.status ? result.status : 500).json({ message: result.message, status: result.status, valid: false });
    return res.status(201).json({ message: result.message, status: result.status, value: result.value, valid: true });
});


router.post("/deleteColor/:id", async (req, res) => {
    // supprime une couleur à partir de son id (logical delete)
    // demande un token JWT en header Authorization Bearer <token>
    // seulement les admin peuvent accéder à cette route
    const adminCheck = await adminOnly(req, res);
    if (!adminCheck.valid) return res.status(adminCheck.status).json({ message: adminCheck.message });

    const result = await deleteColorController(req);
    if (!result.valid) return res.status(result.status ? result.status : 500).json({ message: result.message, status: result.status, valid: false });
    return res.status(200).json({ message: result.message, status: result.status, valid: true });

});


module.exports = router;
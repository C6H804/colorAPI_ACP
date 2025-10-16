const express = require("express");
const router = express.Router();

const auth = require("../middlewares/auth");
const verifyPermissions = require("../utils/_VerifyPermissions");
const permissionList = require("../controllers/permissionsList.controller");
const permissionUsers = require("../controllers/permissionsListUser.controller");
const loginController = require("../controllers/login.controller");
const registerController = require("../controllers/register.controller");
const getUsers = require("../dao/getUsers.dao");
const getLogs = require("../dao/getLogs.dao");
const editUser = require("../controllers/editUser.controller");
const deleteUser = require("../controllers/deleteUser.controller");



router.post("/login", async (req, res) => {
    // pour se connecter au compte à partir de l'username et du password - renvoie un token JWT

    // console.log("post request received in login/");
    
    const result = await loginController(req);
    if (!result.valid) return res.status(result.status ? result.status : 500).json({ valid:false, message: result.message, status: result.status });
    return res.status(200).json({valid:true, message: result.message, status: result.status, value: result.value });
});

router.use(auth);

const adminOnly = async (req, res) => {
    const verify = await verifyPermissions(req.user, ["admin", "moderator"]);
    if (!verify.valid) return res.status(verify.status).json({ message: verify.message });
    return { valid: true, message: "Authorized", status: 200, value: null };
};


router.get("/users", async (req, res) => {
    // renvoie la liste des utilisateurs qui n'ont pas était supprimé (logical delete) demande un token JWT en header Authorization Bearer <token>
    // seulement les admin peuvent accéder à cette route
    const adminCheck = await adminOnly(req, res);
    if (!adminCheck.valid) return res.status(adminCheck.status).json({ message: adminCheck.message, valid: false });

    // console.log("get request received in users/");

    const users = await getUsers();
    if (!users.valid) return res.status(users.status).json({ message: users.message, valid: false });
    return res.status(200).json({ message: users.message, value: users.value, valid: true });
});

router.post("/addUser", async (req, res) => {
    // ajoute un utilisateur à partir d'un username et d'un password et en option une description
    // vérifie que le corps de la requête contient les informations nécessaires
    // seulement les admin peuvent accéder à cette route
    const adminCheck = await adminOnly(req, res);
    if (!adminCheck.valid) return res.status(adminCheck.status).json({ message: adminCheck.message });

    // console.log("post request received in addUser/");
    
    const result = await registerController(req);
    if (!result.valid) return res.status(result.status ? result.status : 500).json({ message: result.message, status: result.status, valid: false });
    return res.status(201).json({ message: result.message, status: result.status, value: result.value, valid: true });
});


router.post("/editUser/:id", async (req, res) => {
    // modifie les données d'un utilisateur (username, description) et les permissions de l'utilisateur
    // récupère l'id de l'utilisateur à modifier dans les paramètres de l'URL
    // seulement les admin peuvent accéder à cette route
    const adminCheck = await adminOnly(req, res);
    if (!adminCheck.valid) return res.status(adminCheck.status).json({ message: adminCheck.message });

    // console.log("get request received in editUser/:id");

    if (!req.params.id || req.params.id <= 0 || isNaN(parseInt(req.params.id, 10)) || !Number.isInteger(parseInt(req.params.id, 10))) return res.status(400).json({ message: "id is not valid", status: 400 });
    const result = await editUser(req);
    return res.status(result.status).json({ message: result.message, status: result.status, valid: result.valid });
});

router.post("/deleteUser/:id", async (req, res) => {
    // supprime un utilisateur (logical delete)
    // récupère l'id de l'utilisateur à supprimer dans les paramètres de l'URL
    // seulement les admin peuvent accéder à cette route
    const adminCheck = await adminOnly(req, res);
    if (!adminCheck.valid) return res.status(adminCheck.status).json({ message: adminCheck.message });
    if (!req.params.id || req.params.id <= 0 || isNaN(parseInt(req.params.id, 10)) || !Number.isInteger(parseInt(req.params.id, 10))) return res.status(400).json({ message: "id is not valid", status: 400 });

    // console.log("get request received in deleteUser/:id");

    const result = await deleteUser(req, parseInt(req.params.id, 10));
    return res.status(result.status).json({ message: result.message, status: result.status, valid: result.valid });
});


router.get("/permissions", async (req, res) => {
    // renvoie la liste des permissions disponibles
    // seulement les admin peuvent accéder à cette route
    const adminCheck = await adminOnly(req, res);
    if (!adminCheck.valid) return res.status(adminCheck.status).json({ message: adminCheck.message });

    // console.log("get request received in permissions/");

    const list = await permissionList(req);
    if (!list.valid) return res.status(list.status).json({ message: list.message, valid: false });
    return res.status(200).json({ message: list.message, value: list.value, valid: true });

});


router.get("/permissions/:id", async (req, res) => {
    // renvoie la liste des permissions d'un utilisateur
    // récupère l'id de l'utilisateur dans les paramètres de l'URL
    // seulement les admin peuvent accéder à cette route
    const adminCheck = await adminOnly(req, res);
    if (!adminCheck.valid) return res.status(adminCheck.status).json({ message: adminCheck.message });

    // console.log("get request received in permissions/:id");

    const list = await permissionUsers(req)
    if (!list.valid) return res.status(list.status).json({ message: list.message });
    return res.status(200).json({ message: list.message, value: list.value });
});

// const grantPermission = async (req) => {
//     const adminCheck = await adminOnly(req, res);
//     if (!adminCheck.valid) return res.status(adminCheck.status).json({ message: adminCheck.message });

//     if (!req.params.id || isNaN(parseInt(req.params.id, 10)) || !Number.isInteger(parseInt(req.params.id, 10)) || parseInt(req.params.id, 10) <= 0) return { valid: false, message: "id is not valid", status: 400 };
//     const userId = parseInt(req.params.id, 10);
//     const permissions = req.body.permissions;
//     if (!permissions || !Array.isArray(permissions) || permissions.length === 0) return { valid: false, message: "permissions is required and should be a non-empty array", status: 400 };
// }

router.get("/logs", async (req, res) => {
    // renvoie les logs de l'application
    // seulement les admin peuvent accéder à cette route
    const adminCheck = await adminOnly(req, res);
    if (!adminCheck.valid) return res.status(adminCheck.status).json({ message: adminCheck.message });

    // console.log("get request received in logs");

    const logs = await getLogs();
    if (!logs.valid) return res.status(logs.status).json({ message: logs.message });
    return res.status(200).json({ message: logs.message, value: logs.value });

});







module.exports = router;
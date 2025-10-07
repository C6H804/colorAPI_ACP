const express = require("express");
const router = express.Router();

const auth = require("../middlewares/auth");
const getUserUserPermissions = require("../dao/permissions.dao").getUserUserPermissions;

router.use(auth);
router.get("/auth", async (req, res) => {
    // get permissions of the user from the token JWT in header Authorization Bearer <token>
    // si le token est valide, renvoie les permissions de l'utilisateur
    // sinon renvoie une erreur 401 Unauthorized
    // console.log("Authorization header:", req.headers.authorization); // Debugging line
    const permissions = await getUserUserPermissions(req.user.value.id);
    if (!permissions.valid) return res.status(200).json({ valid: true, message: "Authenticated but no permissions", value: { permissions: []} });
    res.status(200).json({ valid: true, message: "Authenticated", value: { permissions: permissions.value } });
});


module.exports = router;
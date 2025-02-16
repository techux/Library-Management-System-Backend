const express = require('express');
const {
    loginController, 
    registerController, 
    changePasswordController, 
    checkAuthController, 
    logoutController
    } = require("../controllers/auth.controller");


const {auth} = require("../middlewares/auth.middleware");

const router = express.Router();

router.get("/check", auth, checkAuthController);
router.get("/logout", auth, logoutController);
router.post("/login", loginController);
router.post("/register", registerController);
router.post("/change-password", auth, changePasswordController);

module.exports = router;
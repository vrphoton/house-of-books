const express           = require("express");
const router            = express.Router();
const userController    = require('../modules/User/user.controller');

//User Register API
router.get("/register",  userController.sendRegisterPage);

router.post("/auth/register",  userController.handleUserRegister);

//User Login API
router.get("/login",  userController.sendLoginPage);

module.exports = router;
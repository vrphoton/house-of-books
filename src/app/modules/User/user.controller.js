const userService       = require('../User/user.service');
const logger            = require('../../middleware/log');
const generateUniqueId  = require("generate-unique-id");

class UserController {

    async sendRegisterPage(req, res, next) {
        logger.info('Controller: sendRegisterPage');
        res.render("register");
    }

    async sendLoginPage(req, res, next) {       
        logger.info('Controller: sendLoginPage');
        res.render("login");
    }

    async handleUserRegister(req, res, next) {
        logger.info('Controller: handleUserRegister');
        let userInfo  = {
            name        : req.body.name,
            email       : req.body.email,
            password    : req.body.password,
            confirm_password : req.body.confirm_password
        };
        let result = await userService.checkAndCreateUser(userInfo);
        if(result) {
            res.render("register", {message: "User successfully registered"});
        }
        else {
            res.render("register", {message: "An error has occured while register"});
        }
    }

}

module.exports = new UserController();
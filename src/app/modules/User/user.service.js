const userRepo  = require('../User/user.repository');
const logger    = require("../../middleware/log");

class UserService {

    async checkAndCreateUser(userData) {
        try {
            if(!userData || (userData && Object.keys(userData).length == 0)) {
                logger.error(`All details are needed to create the user`);
                throw new Error("All details are needed to create the user");
            }
            return await userRepo.checkAndCreateUser(userData);
        } catch (error) {
            return error.message;
        }
    }    

}

module.exports = new UserService();
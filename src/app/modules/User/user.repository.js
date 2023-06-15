const userDAO                   = require('./userDAO');
const logger                    = require('../../middleware/log');

class UserRepository {  

    async checkAndCreateUser(userData) {
        return await userDAO.checkAndCreateUser(userData);
    }

}

module.exports = new UserRepository();
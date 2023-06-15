// const {User}      = require('../../model/user');

class UserDAO {

    async checkAndCreateUser(data) {
        // try {
        //     const newUser   = new User(data);
        //     const result    = await newUser.registerUser();
        //     return result;
        // } catch (error) {
        //     let defaultErrorMsge = "Failed regster a user.";
        //     return error.message ? error.message : defaultErrorMsge;
        // }
        console.log("data", data);
        return "Success"
    }

}

module.exports = new UserDAO();

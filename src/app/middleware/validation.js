const validator = require('../utils/validate');
const logger    = require("../middleware/log");

const validateBook = async (req, res, next) => {
    const validationRule = {
        "name"          : "required|string",
        "description"   : "required|string",
        "author"        : "required|string",
        "publication"   : "required|integer"
    };
    const validationMessage = {
        "name"          : "Book name is required",
        "description"   : "Book description is required",
        "author"        : "Book author is required",
        "publication"   : "Book publication year is required"
    }
    let data = req.body.book;
    await validator(data, validationRule, validationMessage, (err, status) => {
        if (!status) {
            res.status(412).json({
                success     : false,
                message     : 'Book validation failed',
                data        : err.errors
            });
        } else {
            next();
        }
    }).catch(err => {
        next(err)
    });
}

module.exports = {
    validateBook
};
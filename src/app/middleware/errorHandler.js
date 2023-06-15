const logger = require("../middleware/log");

const exceptionHandler = (err, req, res, next) => {
    logger.error("Caught exception handler in errorHandler Middleware");
    logger.error(err);
    let statusCode  = 500;
    let message     = "Internal Server Error";
    // need to handle any custom Error
    res.status(statusCode).json({error: message});
}

module.exports = exceptionHandler;
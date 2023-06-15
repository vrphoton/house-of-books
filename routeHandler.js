const express           = require("express");
const router            = express.Router();
const bookHandler       = require("./src/app/routers/book");
const userHandler       = require("./src/app/routers/user");

//Books API call router
router.use("/books",  bookHandler);

//User API call router
router.use("/user",  userHandler);

module.exports = router;
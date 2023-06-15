const express           = require("express");
const router            = express.Router();
const bookController    = require('../modules/Book/book.controller');
const bookValidator     = require("../middleware/validation");

//API to get all the books
router.get("/all",  bookController.getBooks);

//API to add a new book
router.post("/new",  bookValidator.validateBook, bookController.addBook);

//API to update a existing book data
router.put("/update/:bookid",  bookValidator.validateBook, bookController.updateBook);

//API to delete a existing book
router.delete("/delete/:bookid",  bookController.deleteBook);

module.exports = router;
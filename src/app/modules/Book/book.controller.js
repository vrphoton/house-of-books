const bookService       = require('../Book/book.service');
const logger            = require('../../middleware/log');
const generateUniqueId  = require("generate-unique-id");

const getBookData = (book, bookid) => {
    let {name, description, author, publication } = book;
    let bookData = {
        name            : name,
        description     : description,
        author          : author,
        publication     : publication,
        createdAt       : new Date()
    }
    return bookData;
}

class BookController {
    async getBooks(req, res, next) {
        try {
            let result = await bookService.getBooks();
            if(result?.length) {
                res.status(200).json(result);
            }
            else {
                res.status(200).json("No books available");
            }
        } catch (error) {
            next(error);
        }
    }

    async addBook(req, res, next) {       
        try {
            let bookData  = getBookData(req.body.book, null);
            if(bookData.name && bookData.description && bookData.author && bookData.publication) {
                let result    = await bookService.addBook(bookData);
                if(result && Object.keys(result).length) {
                    res.status(201).json(result);
                }
                else {
                    res.status(400).json("An error has occured while adding the books");
                }
            }
            else {
                res.status(400).json("All the fields are required");
            }            
        } catch (error) {
            next(error);
        }
    }

    async updateBook(req, res, next) {
        try {
            let {bookid}    = req.params;
            let bookData    = getBookData(req.body.book, bookid);
            if(bookid && bookData.name && bookData.description && bookData.author && bookData.publication) {
                let result    = await bookService.updateBook(bookid, bookData);
                if(result && Object.keys(result).length) {
                    res.status(200).json(result);
                }
                else {
                    res.status(400).json("An error has occured while updating the books");
                }
            }
            else {
                res.status(400).json("All the fields are required");
            }            
        } catch (error) {
            next(error);
        }
    }

    async deleteBook(req, res, next) {        
        try {
            let {bookid} = req.params;
            if(bookid) {
                let result    = await bookService.deleteBook(bookid);
                if(result) {
                    res.status(204).json(result);
                }
                else {
                    res.status(400).json("An error has occured while deleting the book");
                }
            }
            else {
                res.status(400).json("Book ID is required");
            }            
        } catch (error) {
            next(error);
        }       
    }

}

module.exports = new BookController();
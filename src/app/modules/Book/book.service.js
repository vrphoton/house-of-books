const bookRepo  = require('../Book/book.repository');
const logger    = require("../../middleware/log");

class BookService {
    
    async getBooks() {
        return await bookRepo.getBooks();
    }

    async addBook(bookData) {
        try {
            if(!bookData || (bookData && Object.keys(bookData).length == 0)) {
                logger.error(`All details are needed to create the book`);
                throw new Error("All details are needed to create the book");
            }
            return await bookRepo.addBook(bookData);
        } catch (error) {
            return error.message;
        }
    }

    async updateBook(bookid, bookData) {
        try {
            if(!bookData || (bookData && Object.keys(bookData).length == 0)) {
                logger.error(`All details are needed to update the book`);
                throw new Error("All details are needed to update the book");
            }
            return await bookRepo.updateBook(bookid, bookData);
        } catch (error) {
            return error.message;
        }
        
    }

    async deleteBook(bookid) {
        try {
            if(!bookid) {
                logger.error(`Book ID is needed to delete the book`);
                throw new Error("Book ID is needed to delete the book");
            }
            return await bookRepo.deleteBook(bookid);
        } catch (error) {
            return error.message;
        }
        
    }

}

module.exports = new BookService();
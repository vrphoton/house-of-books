const { connect, disconnect }   = require('../../config/db');
const bookDAO                   = require('../Book/bookDAO');
const logger                    = require('../../middleware/log');
let booksCache                  = [];

const cacheTheResult = (books) => {
    booksCache = books;
}

class BookRepository {

    constructor() {
        connect(process.env.DB_URL);        
    }    

    async getBooks() {
        if(booksCache?.length) {
            logger.info(`Books are served from cache and the total count of book is ${booksCache.length}`);
            return booksCache;
        }
        let books = await bookDAO.getBooks();
        cacheTheResult(books);
        logger.info(`Books are fetched newly and the total count of book is ${books.length}`);
        return books;
    }

    async addBook(bookData) {
        return await bookDAO.addBook(bookData);
    }

    async updateBook(bookid, bookData) {       
        return await bookDAO.updateBook(bookid, bookData);    
    }

    async deleteBook(bookid) {
        return await bookDAO.deleteBook(bookid);        
    }

}

module.exports = new BookRepository();
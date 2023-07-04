const {Book}      = require('../../model/book');

class BookDAO {

    async getBooks() {
        try {
            const books = await Book.getBooks();
            return books;
        } catch (error) {
            let defaultErrorMsge = "Failed to retrieve all the books.";
            return error.message ? error.message : defaultErrorMsge;
        }
    }

    async addBook(data) {
            try {
                const newBook   = new Book(data);
                const result    = await newBook.addBook();
                return result;
            } catch (error) {
                let defaultErrorMsge = "Failed to add the book.";
                return error.message ? error.message : defaultErrorMsge;
            }
    }

    async updateBook(id, data) {
        try {
            const result  = await Book.updateBook(id, data, {new : true});
            return result;
        } catch (error) {
            let defaultErrorMsge = "Failed to update the book.";
            return error.message ? error.message : defaultErrorMsge;
        }
    }

    async deleteBook(id) {
        try {
            const result = await Book.deleteBook(id);
            return result;
        } catch (error) {
            let defaultErrorMsge = "Failed to delete the book.";
            return error.message ? error.message : defaultErrorMsge;
            
        }  
    }

}

module.exports = new BookDAO();

const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema(
    { 
        id              : 'string', 
        name            : 'string', 
        description     : 'string', 
        createdAt       : 'string', 
        author          : 'string',
        publication     : "number"
    }
);

bookSchema.statics.getBooks = function(cb) {
    return this.find({}, {__v : 0}, cb);
}

bookSchema.statics.getBookById = function(_id, cb) {
    return this.findOne({_id}, {__v : 0}, cb);
}

bookSchema.methods.addBook = function(cb) {
    return this.save(cb);
}

bookSchema.statics.updateBook = function(id, data, opt, cb) {
    return this.findByIdAndUpdate(id, data, opt, cb);
}

bookSchema.statics.deleteBook = function(id, cb) {
    return this.findByIdAndDelete(id, cb);
}

const Book = mongoose.model('Books', bookSchema);

module.exports = {
    Book
}
const chai              = require("chai");
const sinon             = require("sinon");
const generateUniqueId  = require("generate-unique-id");
const faker             = require("faker");
const expect            = chai.expect;
const BookRepo          = require("../Book/book.repository");
const BookDAO           = require("../Book/bookDAO");

describe("Book Repository", function() {    
    describe("List all the books", function() { 
        let mockResult, getBooksStub; 
        beforeEach(() => {
            getBooksStub    = sinon.stub(BookDAO, "getBooks");
            mockResult       = [{
                createdAt   : faker.date.past(),
                name        : faker.name.findName(),
                description : faker.lorem.words(),
                author      : faker.internet.userName(),
                publication : faker.datatype.number(),
                id          : generateUniqueId({length: 2, useLetters: false})
            }];
        });
        afterEach(() => {
            mockResult = [];
            getBooksStub.restore();
        }); 
        it("Should return empty array if no books available", async () => {
            let stub      = getBooksStub.resolves([]);
            const books   = await BookRepo.getBooks();
            expect(stub.calledOnce).to.be.true;
            expect(books).to.be.an('array'); 
            expect(books).to.have.lengthOf(0);
        });
        it("Should return all the books as array", async () => {            
            let stub      = getBooksStub.resolves(mockResult);
            const books   = await BookRepo.getBooks();
            expect(stub.calledOnce).to.be.true;
            expect(books).to.be.an('array');
        });
        it("Should return an array of books with the properties {id, name, description, author, publication, createdAt}", async () => {
            let stub      = getBooksStub.resolves(mockResult);
            const books   = await BookRepo.getBooks();
            // expect(stub.calledOnce).to.be.true;
            expect(books).to.be.an('array'); 
            books.forEach((book) => {
                expect(book.id).to.be.a("string");
                expect(book.name).to.be.a("string");
                expect(book.description).to.be.a("string");
                expect(book.author).to.be.a("string");
                expect(book.publication).to.be.a("number");
                // expect(book.createdAt).to.be.an("object");
            });            
        });        
    });
    describe("Add a new Book", function() { 
        let addBookStub, mockResult, mockData; 
        beforeEach(() => {
            addBookStub    = sinon.stub(BookDAO, "addBook");
            mockData       = {
                name        : faker.name.findName(),
                description : faker.lorem.words(),
                author      : faker.internet.userName(),
                publication : faker.datatype.number()
            };
            mockResult     = {
                name        : mockData.name,
                description : mockData.description,
                author      : mockData.author,
                publication : mockData.publication,
                createdAt   : faker.date.past(),
                id          : generateUniqueId({length: 2, useLetters: false})
            };
        });
        afterEach(() => {
            addBookStub.restore();
        });    
        it("Should not add a new book if the data doesn't have these properties { name, description, author, publication }", async () => {
            let stub        = addBookStub.returns({ status : 412, body : {message : "Book validation failed"} });
            const newBook   = await BookRepo.addBook({});
            expect(stub.calledOnce).to.be.true;
            expect(newBook).to.have.status(412);
            expect(newBook.body.message).to.equal("Book validation failed");       
        });
        it("Should thorw an error if book data is empty", async () => {
            let error = new Error('All details are needed to create the book');
            addBookStub.rejects(error);
            try {
                await BookRepo.addBook({});
                expect.fail("An error will occur if empty data is passed");
            } catch (err) {
                expect(err).to.equal(error);
            }                   
        });
        it("Should add a new book if the data has these properties { name, description, author, publication }", async () => {
            let stub        = addBookStub.returns(mockResult);
            const newBook   = await BookRepo.addBook(mockData);
            expect(stub.calledOnce).to.be.true;
            expect(newBook).to.be.an('object');
            expect(newBook).to.have.property('name');
            expect(newBook).to.have.property('description');
            expect(newBook).to.have.property('author');
            expect(newBook).to.have.property('publication');
            expect(newBook).to.have.property('id');
            expect(newBook).to.have.property('createdAt');
            expect(newBook.name).to.be.a('string');
            expect(newBook.description).to.be.a('string');
            expect(newBook.author).to.be.a('string');
            expect(newBook.publication).to.be.a('number');
            expect(newBook.id).to.be.a('string');
        });        
    });
    describe("Update an existing book", function() { 
        let updateBookStub, mockResult, mockData; 
        beforeEach(() => {
            updateBookStub = sinon.stub(BookDAO, "updateBook");
            mockData       = {
                name        : faker.name.findName(),
                description : faker.lorem.words(),
                author      : faker.internet.userName(),
                publication : faker.datatype.number()
            };
            mockResult     = {
                name        : mockData.name,
                description : mockData.description,
                author      : mockData.author,
                publication : mockData.publication,
                createdAt   : faker.date.past(),
                id          : generateUniqueId({length: 2, useLetters: false})
            };
        });
        afterEach(() => {
            updateBookStub.restore();
        });    
        it("Should not udate book if the data doesn't have these properties { name, description, author, publication }", async () => {
            let stub     = updateBookStub.returns({ status : 412, body : {message : "Book validation failed"} });
            const book   = await BookRepo.updateBook(1, {});
            expect(stub.calledOnce).to.be.true;
            expect(book).to.have.status(412);
            expect(book.body.message).to.equal("Book validation failed");       
        });
        it("Should thorw an error if book data is empty", async () => {
            let error = new Error('All details are needed to create the book');
            updateBookStub.rejects(error);
            try {
                await BookRepo.updateBook(1, {});
                expect.fail("An error will occur if empty data is passed");
            } catch (err) {
                expect(err).to.equal(error);
            }                   
        });
        it("Should update book if the data has these properties { name, description, author, publication }", async () => {
            let stub = updateBookStub.returns(mockResult);
            const updatedBook   = await BookRepo.updateBook(1, mockData);
            expect(stub.calledOnce).to.be.true;
            expect(updatedBook).to.be.an('object');
            expect(updatedBook).to.have.property('name');
            expect(updatedBook).to.have.property('description');
            expect(updatedBook).to.have.property('author');
            expect(updatedBook).to.have.property('publication');
            expect(updatedBook).to.have.property('id');
            expect(updatedBook).to.have.property('createdAt');
            expect(updatedBook.name).to.be.a('string');
            expect(updatedBook.description).to.be.a('string');
            expect(updatedBook.author).to.be.a('string');
            expect(updatedBook.publication).to.be.a('number');
            expect(updatedBook.id).to.be.a('string');
        });        
    });
    describe("Delete an existing book", function() { 
        let deleteBookStub, mockResult; 
        beforeEach(() => {
            deleteBookStub    = sinon.stub(BookDAO, "deleteBook");
            mockResult        = {
                createdAt   : faker.date.past(),
                name        : faker.name.findName(),
                description : faker.lorem.words(),
                author      : faker.internet.userName(),
                publication : faker.datatype.number(),
                id          : generateUniqueId({length: 2, useLetters: false})
            }            
        });
        afterEach(() => {
            deleteBookStub.restore();
        });
        it("Should thorw an error if bookid is not passed", async () => {
            let error = new Error('Book ID is needed to delete the book');
            let stub = deleteBookStub.rejects(error);
            try {
                await BookRepo.deleteBook();
                expect.fail("An error will occur since the bookid is not exist");
            } catch (err) {
                expect(stub.calledOnce).to.be.true;
                expect(err).to.equal(error);
            }                   
        });
        it("Should delete the book if it's exist", async () => {
            let stub = deleteBookStub.returns(mockResult);
            const deletedBook   = await BookRepo.deleteBook(4);
            expect(stub.calledOnce).to.be.true;
            expect(deletedBook).to.be.an('object');
            expect(deletedBook).to.have.property('name');
            expect(deletedBook).to.have.property('description');
            expect(deletedBook).to.have.property('author');
            expect(deletedBook).to.have.property('publication');
            expect(deletedBook).to.have.property('id');
            expect(deletedBook).to.have.property('createdAt');
            expect(deletedBook.name).to.be.a('string');
            expect(deletedBook.description).to.be.a('string');
            expect(deletedBook.author).to.be.a('string');
            expect(deletedBook.publication).to.be.a('number');
            expect(deletedBook.id).to.be.a('string');
        });        
    });
      
});
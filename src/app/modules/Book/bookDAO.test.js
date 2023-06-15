const chai              = require("chai");
const chaiHttp          = require("chai-http");
const sinon             = require("sinon");
const generateUniqueId  = require("generate-unique-id");
const faker             = require("faker");
const expect            = chai.expect;
const BookDAO           = require("../Book/bookDAO");
const {Book}            = require("../../model/book");
const assert            = require("assert");

chai.use(chaiHttp);

describe("Book DAO", function() {    
    describe("Get all books", function() { 
        let mockResult, getBooksStub;       
        beforeEach(() => {
            getBooksStub    = sinon.stub(Book, "getBooks");
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
            getBooksStub.restore();
            mockResult = [];
        });          
        it("Should return all the books as array", async () => {            
            let stub      = getBooksStub.returns(mockResult);
            const books   = await BookDAO.getBooks();
            expect(stub.calledOnce).to.be.true;
            expect(books).to.be.an('array');
        });
        it("In case of any error it should return the error message", async () => {            
            let stub       = getBooksStub.rejects("Failed to retrieve all the books.");
            const result   = await BookDAO.getBooks();
            expect(stub.calledOnce).to.be.true;
            expect(result).to.equal('Failed to retrieve all the books.');
        });
        it("Should return an array of books with the properties {id, name, description, author, publication, createdAt}", async () => {
            let stub      = getBooksStub.returns(mockResult);
            const books   = await BookDAO.getBooks();
            expect(stub.calledOnce).to.be.true;
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
        it("Should return empty array if no books available", async () => {
            let stub      = getBooksStub.returns([]);
            const books   = await BookDAO.getBooks();
            expect(stub.calledOnce).to.be.true;
            expect(books).to.be.an('array'); 
            expect(books).to.have.lengthOf(0);
        });
    });
    describe("Add a new Book", function() { 
        let addBookStub, mockResult, mockData; 
        beforeEach(() => {
            addBookStub     = sinon.stub(Book.prototype, "addBook");
            mockData        = {
                name        : faker.name.findName(),
                description : faker.lorem.words(),
                author      : faker.internet.userName(),
                publication : faker.datatype.number(),
            };
            mockResult      = {
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
            mockResult  = {};
            mockData    = {};
        }); 
        it("Should thorw an error if book data is empty", async () => {
            let stub       = addBookStub.returns("All details are needed to create the book");
            const result   = await BookDAO.addBook(null);
            expect(stub.calledOnce).to.be.true;
            expect(result).to.equal("All details are needed to create the book");
        });   
        it("In case of any error it should return the error message", async () => {            
            let stub        = addBookStub.rejects("Failed to add the book.");
            const result    = await BookDAO.addBook();
            expect(stub.calledOnce).to.be.true;
            expect(result).to.equal("Failed to add the book.");
        });
        it("Should not add a new book if the data doesn't have these properties { name, description, author, publication }", async () => {
            let stub        = addBookStub.returns("All details are needed to create the book");
            const newBook   = await BookDAO.addBook({});
            expect(stub.calledOnce).to.be.true;
            expect(newBook).to.equal("All details are needed to create the book");
        });        
        it("Should add a new book if the data has these properties { name, description, author, publication }", async () => {
            let stub        = addBookStub.returns(mockResult);
            const newBook   = await BookDAO.addBook(mockData);
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
            updateBookStub    = sinon.stub(Book, "updateBook");
            mockResult        = {
                createdAt   : faker.date.past(),
                name        : faker.name.findName(),
                description : faker.lorem.words(),
                author      : faker.internet.userName(),
                publication : faker.datatype.number(),
                id          : generateUniqueId({length: 2, useLetters: false})
            };
            mockData        = {
                name        : mockResult.name,
                description : mockResult.description,
                author      : mockResult.author,
                publication : mockResult.publication
            }
        });
        afterEach(() => {
            updateBookStub.restore();
        });    
        it("Should thorw an error if book data is empty", async () => {
            let stub        = updateBookStub.returns("All details are needed to update the book");
            const newBook   = await BookDAO.updateBook(2, null);
            expect(stub.calledOnce).to.be.true;
            expect(newBook).to.equal("All details are needed to update the book");             
        });
        it("In case of any error it should return the error message", async () => {            
            let stub        = updateBookStub.rejects("Failed to update the book.");
            const result    = await BookDAO.updateBook(2, null);
            expect(stub.calledOnce).to.be.true;
            expect(result).to.equal("Failed to update the book.");
        });
        it("Should not udate book if the data doesn't have these properties { name, description, author, publication }", async () => {
            let stub     = updateBookStub.returns("All details are needed to update the book");
            const result = await BookDAO.updateBook(1, {});
            expect(stub.calledOnce).to.be.true;
            expect(result).to.equal("All details are needed to update the book");       
        });
        it("Should update book if the data has these properties { name, description, author, publication }", async () => {
            let stub            = updateBookStub.returns(mockResult);
            const updatedBook   = await BookDAO.updateBook(1, mockData);
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
            deleteBookStub    = sinon.stub(Book, "deleteBook");
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
            let stub       = deleteBookStub.returns("Book ID is needed to delete the book");
            const result   = await BookDAO.deleteBook(null);
            expect(stub.calledOnce).to.be.true;
            expect(result).to.equal("Book ID is needed to delete the book");                          
        });
        it("In case of any error it should return the error message", async () => {            
            let stub        = deleteBookStub.rejects("Failed to delete the book.");
            const result    = await BookDAO.deleteBook('ff4');
            expect(stub.calledOnce).to.be.true;
            expect(result).to.equal("Failed to delete the book.");
        });
        it("Should delete the book if it's exist", async () => {
            let stub = deleteBookStub.returns(mockResult);
            const deletedBook = await BookDAO.deleteBook(4);
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
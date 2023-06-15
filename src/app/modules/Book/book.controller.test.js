const chai              = require("chai");
const sinon             = require("sinon");
const sinonChai         = require('sinon-chai')
const _                 = require("lodash");
const expect            = chai.expect;
const chaiHttp          = require("chai-http");
const generateUniqueId  = require("generate-unique-id");
const faker             = require("faker");
const bookService       = require("../Book/book.service");
const bookController    = require("../Book/book.controller");
const exceptionHandler  = require('../../middleware/errorHandler');

chai.use(chaiHttp);
chai.use(sinonChai)

describe("Book Controller", function() {    
    describe("Get all books", function() {
        let req, res, next, status, json, mockResult, getBooksStub;
        beforeEach(() => {
            req             = {};
            status          = sinon.stub();
            json            = sinon.spy();
            res             = { json, status };
            next            = sinon.stub();
            status.returns(res);
            getBooksStub     = sinon.stub(bookService, "getBooks");           
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
        it("Should return all the books", async () => {
            let stub = getBooksStub.returns(mockResult);
            await bookController.getBooks(req, res, next);
            expect(stub.calledOnce).to.be.true;
            expect(status.args[0][0]).to.equal(200);
            expect(json.calledOnce).to.be.true;
            expect(json.args[0][0]).to.be.an("array");
            expect(json.args[0][0]).to.have.length(mockResult.length);
        });    
        it("Should return 'No books available' if books are not exist", async () => {
            getBooksStub.returns([]);
            let req  = {};
            await bookController.getBooks(req, res, next);
            expect(status.calledOnce).to.be.true;
            expect(status.args[0][0]).to.equal(200);
            expect(json.calledOnce).to.be.true;
            expect(json.args[0][0]).to.equal("No books available");
        });  
        it("Should execute the common exception handler if any error has thrown", async () => {
            let err = new Error('Some error has occured and its thrown');
            getBooksStub.returns(next(err));
            let req = {};
            await bookController.getBooks(req, res, next);
            expect(next).to.have.been.calledWith(err);
        });  
    });
    describe("Add a new book", function() {
        let res, next, status, json, mockResult, addBookStub, mockData;
        beforeEach(() => {
            status          = sinon.stub();
            json            = sinon.spy();
            res             = { json, status };
            next            = sinon.stub();
            status.returns(res);
            addBookStub     = sinon.stub(bookService, "addBook"); 
            mockData        = {
                name        : faker.name.findName(),
                description : faker.lorem.words(),
                author      : faker.internet.userName(),
                publication : faker.datatype.number()
            };          
            mockResult       = {
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
            mockData   = {};
            mockResult = [];
        });
        it("Should add new book if all the fields are provided {name, description, author, publication} ", async () => {
            let stub = addBookStub.returns(mockResult);
            let req  = {body : { book : mockData}};
            await bookController.addBook(req, res, next);
            expect(stub.calledOnce).to.be.true;
            expect(status.args[0][0]).to.equal(201);
            expect(json.calledOnce).to.be.true;
            expect(json.args[0][0]).to.be.an("object");
            expect(json.args[0][0]['name']).to.equal(mockData.name);
            expect(json.args[0][0]['description']).to.equal(mockData.description);
            expect(json.args[0][0]['author']).to.equal(mockData.author);
            expect(json.args[0][0]['publication']).to.equal(mockData.publication);

        }); 
        it("Should send an error if the result is not valid", async () => {
            addBookStub.returns({});
            let req  = {body : { book : mockData}};
            await bookController.addBook(req, res, next);
            expect(status.calledOnce).to.be.true;
            expect(status.args[0][0]).to.equal(400);
            expect(json.calledOnce).to.be.true;
            expect(json.args[0][0]).to.equal("An error has occured while adding the books");
        }); 
        it("Should not add new book if name is not provided", async () => {
            addBookStub.returns("All the fields are required");
            let data = _.merge({}, mockData);
            delete data.name;
            let req  = {body : { book : data}};
            await bookController.addBook(req, res, next);
            expect(status.calledOnce).to.be.true;
            expect(status.args[0][0]).to.equal(400);
            expect(json.calledOnce).to.be.true;
            expect(json.args[0][0]).to.equal("All the fields are required");
        }); 
        it("Should not add new book if description is not provided", async () => {
            addBookStub.returns("All the fields are required");
            let data = _.merge({}, mockData);
            delete data.description;
            let req  = {body : { book : data}};
            await bookController.addBook(req, res, next);
            expect(status.calledOnce).to.be.true;
            expect(status.args[0][0]).to.equal(400);
            expect(json.calledOnce).to.be.true;
            expect(json.args[0][0]).to.equal("All the fields are required");
        });   
        it("Should not add new book if author is not provided", async () => {
            addBookStub.returns("All the fields are required");
            let data = _.merge({}, mockData);
            delete data.author;
            let req  = {body : { book : data}};
            await bookController.addBook(req, res, next);
            expect(status.calledOnce).to.be.true;
            expect(status.args[0][0]).to.equal(400);
            expect(json.calledOnce).to.be.true;
            expect(json.args[0][0]).to.equal("All the fields are required");
        });   
        it("Should not add new book if publication is not provided", async () => {
            addBookStub.returns("All the fields are required");
            let data = _.merge({}, mockData);
            delete data.publication;
            let req  = {body : { book : data}};
            await bookController.addBook(req, res, next);
            expect(status.calledOnce).to.be.true;
            expect(status.args[0][0]).to.equal(400);
            expect(json.calledOnce).to.be.true;
            expect(json.args[0][0]).to.equal("All the fields are required");
        });
        it("Should execute the common exception handler if any error has thrown", async () => {
            let err = new Error('Some error has occured and its thrown');
            addBookStub.returns(next(err));
            let req     = {params : {bookid : 1}};
            await bookController.addBook(req, res, next);
            expect(next).to.have.been.calledWith(err);
        });   
    });
    describe("Update an existing book", function() {
        let res, next, status, json, mockResult, updateBookStub, mockData;
        beforeEach(() => {
            status          = sinon.stub();
            json            = sinon.spy();
            res             = { json, status };
            next            = sinon.stub();
            status.returns(res);
            updateBookStub     = sinon.stub(bookService, "updateBook"); 
            mockData        = {
                name        : faker.name.findName(),
                description : faker.lorem.words(),
                author      : faker.internet.userName(),
                publication : faker.datatype.number()
            };          
            mockResult       = {
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
            mockData   = {};
            mockResult = [];
        });
        it("Should update the book if all the fields are provided {name, description, author, publication} ", async () => {
            let stub = updateBookStub.returns(mockResult);
            let req  = {body : { book : mockData}, params : {bookid : 1}};
            await bookController.updateBook(req, res, next);
            expect(stub.calledOnce).to.be.true;
            expect(status.args[0][0]).to.equal(200);
            expect(json.calledOnce).to.be.true;
            expect(json.args[0][0]).to.be.an("object");
            expect(json.args[0][0]['name']).to.equal(mockData.name);
            expect(json.args[0][0]['description']).to.equal(mockData.description);
            expect(json.args[0][0]['author']).to.equal(mockData.author);
            expect(json.args[0][0]['publication']).to.equal(mockData.publication);
        }); 
        it("Should send an error if the result is not valid", async () => {
            updateBookStub.returns({});
            let req  = {body : { book : mockData}, params : {bookid : 1}};
            await bookController.updateBook(req, res, next);
            expect(status.calledOnce).to.be.true;
            expect(status.args[0][0]).to.equal(400);
            expect(json.calledOnce).to.be.true;
            expect(json.args[0][0]).to.equal("An error has occured while updating the books");
        }); 
        it("Should not update book if name is not provided", async () => {
            updateBookStub.returns("All the fields are required");
            let data = _.merge({}, mockData);
            delete data.name;
            let req  = {body : { book : data}, params : {bookid : 1}};
            await bookController.updateBook(req, res, next);
            expect(status.calledOnce).to.be.true;
            expect(status.args[0][0]).to.equal(400);
            expect(json.calledOnce).to.be.true;
            expect(json.args[0][0]).to.equal("All the fields are required");
        }); 
        it("Should not update book if description is not provided", async () => {
            updateBookStub.returns("All the fields are required");
            let data = _.merge({}, mockData);
            delete data.description;
            let req  = {body : { book : data}, params : {bookid : 1}};
            await bookController.updateBook(req, res, next);
            expect(status.calledOnce).to.be.true;
            expect(status.args[0][0]).to.equal(400);
            expect(json.calledOnce).to.be.true;
            expect(json.args[0][0]).to.equal("All the fields are required");
        });   
        it("Should not update book if author is not provided", async () => {
            updateBookStub.returns("All the fields are required");
            let data = _.merge({}, mockData);
            delete data.author;
            let req  = {body : { book : data}, params : {bookid : 1}};
            await bookController.updateBook(req, res, next);
            expect(status.calledOnce).to.be.true;
            expect(status.args[0][0]).to.equal(400);
            expect(json.calledOnce).to.be.true;
            expect(json.args[0][0]).to.equal("All the fields are required");
        });   
        it("Should not update book if publication is not provided", async () => {
            updateBookStub.returns("All the fields are required");
            let data = _.merge({}, mockData);
            delete data.publication;
            let req  = {body : { book : data}, params : {bookid : 1}};
            await bookController.updateBook(req, res, next);
            expect(status.calledOnce).to.be.true;
            expect(status.args[0][0]).to.equal(400);
            expect(json.calledOnce).to.be.true;
            expect(json.args[0][0]).to.equal("All the fields are required");
        });
        it("Should not update book if bookid is not provided", async () => {
            updateBookStub.returns("All the fields are required");
            let data = _.merge({}, mockData);
            let req  = {body : { book : data}, params : {}};
            await bookController.updateBook(req, res, next);
            expect(status.calledOnce).to.be.true;
            expect(status.args[0][0]).to.equal(400);
            expect(json.calledOnce).to.be.true;
            expect(json.args[0][0]).to.equal("All the fields are required");
        });  
        it("Should execute the common exception handler if any error has thrown", async () => {
            let err = new Error('Some error has occured and its thrown');
            updateBookStub.returns(next(err));
            let req     = {params : {bookid : 1}};
            await bookController.updateBook(req, res, next);
            expect(next).to.have.been.calledWith(err);
        }); 
    });
    describe("Delete an existing book", function() {
        let res, next, status, json, deleteBookStub;
        beforeEach(() => {
            status          = sinon.stub().returnsThis();
            json            = sinon.spy();
            res             = { json, status };
            next            = sinon.stub();
            status.returns(res);
            deleteBookStub     = sinon.stub(bookService, "deleteBook");
        });
        afterEach(() => {
            deleteBookStub.restore();
        });
        it("Should delete the book if bookid is present", async () => {
            let stub = deleteBookStub.returns({});
            let req  = {params : {bookid : 1}};
            await bookController.deleteBook(req, res, next);
            expect(stub.calledOnce).to.be.true;
            expect(status.args[0][0]).to.equal(204);
            expect(json.calledOnce).to.be.true;
        });   
        it("Should send an error if the result is not valid", async () => {
            deleteBookStub.returns(null);
            let req  = {params : {bookid : 1}};
            await bookController.deleteBook(req, res, next);
            expect(status.calledOnce).to.be.true;
            expect(status.args[0][0]).to.equal(400);
            expect(json.calledOnce).to.be.true;
            expect(json.args[0][0]).to.equal("An error has occured while deleting the book");
        });     
        it("Should not delete the book if bookid is not present", async () => {
            deleteBookStub.returns("Book ID is required");
            let req  = {params : {}};
            await bookController.deleteBook(req, res, next);
            expect(status.calledOnce).to.be.true;
            expect(status.args[0][0]).to.equal(400);
            expect(json.calledOnce).to.be.true;
            expect(json.args[0][0]).to.equal("Book ID is required");
        });
        it("Should execute the common exception handler if any error has thrown", async () => {
            let err = new Error('Some error has occured and its thrown');
            deleteBookStub.returns(next(err));
            let req     = {params : {bookid : 1}};
            await bookController.deleteBook(req, res, next);
            expect(next).to.have.been.calledWith(err);
        }); 
    });
});
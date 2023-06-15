const chai              = require("chai");
const chaiHttp          = require("chai-http");
const sinon             = require("sinon");
const _                 = require("lodash");
const generateUniqueId  = require("generate-unique-id");
const faker             = require("faker");
const expect            = chai.expect;
const {validateBook}    = require("../middleware/validation");

chai.use(chaiHttp);

describe("Validation", function() {    
    describe("Validate add book", function() { 
        let res, next, status, json, mockData;
        beforeEach(() => {
            status          = sinon.stub();
            json            = sinon.spy();
            res             = { json, status };
            next            = sinon.stub();
            status.returns(res);
            mockData        = {
                name        : faker.name.findName(),
                description : faker.lorem.words(),
                author      : faker.internet.userName(),
                publication : faker.datatype.number()
            };
        });
        afterEach(() => {
            mockData   = {};
        });
        it("Should send a error if name is not present", async () => {
            let data = _.merge({}, mockData);
            delete data.name;
            let req = {body: {book : data}};
            await validateBook(req, res, next);           
            expect(json.args[0][0]['success']).to.be.false;
            expect(json.args[0][0]['message']).to.equal("Book validation failed");
            expect(json.args[0][0]['data']['name']).to.deep.include("The name field is required.");
        });
        it("Should send a error if description is not present", async () => {
            let data = _.merge({}, mockData);
            delete data.description;
            let req = {body: {book : data}};
            await validateBook(req, res, next);           
            expect(json.args[0][0]['success']).to.be.false;
            expect(json.args[0][0]['message']).to.equal("Book validation failed");
            expect(json.args[0][0]['data']['description']).to.deep.include("The description field is required.");
        });
        it("Should send a error if author is not present", async () => {
            let data = _.merge({}, mockData);
            delete data.author;
            let req = {body: {book : data}};
            await validateBook(req, res, next);           
            expect(json.args[0][0]['success']).to.be.false;
            expect(json.args[0][0]['message']).to.equal("Book validation failed");
            expect(json.args[0][0]['data']['author']).to.deep.include("The author field is required.");
        });
        it("Should send a error if publication is not present", async () => {
            let data = _.merge({}, mockData);
            delete data.publication;
            let req = {body: {book : data}};
            await validateBook(req, res, next);           
            expect(json.args[0][0]['success']).to.be.false;
            expect(json.args[0][0]['message']).to.equal("Book validation failed");
            expect(json.args[0][0]['data']['publication']).to.deep.include("The publication field is required.");
        });
        it("Should pass the validation if all the fields are present", async () => {
            let req = {body: {book : mockData}};
            await validateBook(req, res, next); 
            expect(next).to.have.been.called;
        });
    });    
});
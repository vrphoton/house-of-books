const { expect }        = require('chai');
const sinon             = require('sinon');
const exceptionHandler  = require('../middleware/errorHandler');

describe('Exception Middleware Handler', () => {
    let res, req, next, status, json;
    beforeEach(() => {
        req             = {};
        status          = sinon.stub();
        json            = sinon.spy();
        res             = { json, status };
        next            = sinon.stub();
        status.returns(res);
    });
    it('should handle exceptions and set the appropriate response', () => {
        let err = "Expect some error to be thrown";
        exceptionHandler(err, req, res, next);
        expect(status.calledOnce).to.be.true;
        expect(status.args[0][0]).to.equal(500);
        expect(json.calledOnce).to.be.true;
        expect(json.args[0][0]).to.deep.equal({error: "Internal Server Error"});
    });
});

// Import the dependencies for testing
const chai = require('chai');
const chaiHttp = require('chai-http');
const sinon = require('sinon');

const app = require('../server');
const dynamoService = require('../services/dynamodb.service');

// Configure chai
chai.use(chaiHttp);
chai.should();

describe('DocumentsController', () => {
  // The DynamoDB DocumentClient
  let documentClient;

  beforeEach(() => {
    // Reset the DynamoDB DocumentClient
    documentClient = dynamoService.getDocumentClient();
  });

  describe('GET: /documents', () => {
    afterEach(() => {
      documentClient.scan.restore();
    });

    it('should get all document records', (done) => {
      // Arrange
      const valueMock = {
        Items: [{ id: 5 }, { id: 6 }],
      };

      sinon.stub(documentClient, 'scan').callsFake((params, callback) => {
        callback(undefined, valueMock);
      });

      // Act
      chai
        .request(app)
        .get('/documents')
        .end((err, res) => {
          // Assert
          res.should.have.status(200);
          res.body.length.should.equal(valueMock.Items.length);
          done();
        });
    });
  });

  describe('GET: /documents/{documentId)', () => {
    afterEach(() => {
      documentClient.get.restore();
    });

    it('should get document record with the given ID', (done) => {
      // Arrange
      const expected = { id: 5 };
      const valueMock = {
        Item: expected,
      };

      sinon.stub(documentClient, 'get').callsFake((params, callback) => {
        callback(undefined, valueMock);
      });

      // Act
      chai
        .request(app)
        .get('/documents/5')
        .end((err, res) => {
          // Assert
          res.should.have.status(200);
          res.body.id.should.equal(expected.id);
          done();
        });
    });
  });

  describe('POST: /documents', () => {
    afterEach(() => {
      documentClient.put.restore();
    });

    it("should save a document and return it's ID", (done) => {
      // Arrange
      sinon.stub(documentClient, 'put').callsFake((params, callback) => {
        callback(undefined, {});
      });

      // Act
      chai
        .request(app)
        .post('/documents')
        .send('"fruit":"banana"')
        .end((err, res) => {
          // Assert
          res.should.have.status(200);
          res.body.id.should.exist;
          done();
        });
    });
  });
});

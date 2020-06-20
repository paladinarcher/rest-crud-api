// Import the dependencies for testing
const chai = require('chai');
const chaiHttp = require('chai-http');
const sinon = require('sinon');

const app = require('../server');
const dynamoService = require('../services/dynamodb.service');

// Configure chai
chai.use(chaiHttp);
chai.should();

describe('TableRoutes', () => {
  // The DynamoDB DocumentClient
  let documentClient;

  beforeEach(() => {
    // Reset the DynamoDB DocumentClient
    documentClient = dynamoService.getDocumentClient();
  });

  describe('GET: /table/{tableName})', () => {
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
        .get('/table/dynamoTable')
        .end((err, res) => {
          // Assert
          res.should.have.status(200);
          res.body.length.should.equal(valueMock.Items.length);
          done();
        });
    });

    it('should return a 404 if DynamoDB has an error', (done) => {
      // Arrange
      sinon.stub(documentClient, 'scan').callsFake((params, callback) => {
        callback({}, undefined);
      });

      // Act
      chai
        .request(app)
        .get('/table/dynamoTable')
        .end((err, res) => {
          // Assert
          res.should.have.status(404);
          done();
        });
    });
  });

  describe('GET: /table/{tableName}/{documentId)', () => {
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
        .get('/table/dynamoTable/5')
        .end((err, res) => {
          // Assert
          res.should.have.status(200);
          res.body.id.should.equal(expected.id);
          done();
        });
    });

    it('should return a 404 if DynamoDB has an error', (done) => {
      // Arrange
      sinon.stub(documentClient, 'get').callsFake((params, callback) => {
        callback({}, undefined);
      });

      // Act
      chai
        .request(app)
        .post('/table/dynamoTable/5')
        .end((err, res) => {
          // Assert
          res.should.have.status(404);
          done();
        });
    });
  });

  describe('POST: /table/{tableName}', () => {
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
        .post('/table/dynamoTable')
        .send('"fruit":"banana"')
        .end((err, res) => {
          // Assert
          res.should.have.status(200);
          res.body.id.should.exist;
          done();
        });
    });

    it('should return a 405 if DynamoDB has an error', (done) => {
      // Arrange
      sinon.stub(documentClient, 'put').callsFake((params, callback) => {
        callback({}, undefined);
      });

      // Act
      chai
        .request(app)
        .post('/table/dynamoTable')
        .send('"fruit":"banana"')
        .end((err, res) => {
          // Assert
          res.should.have.status(405);
          done();
        });
    });
  });

  describe('DELETE: /table/{tableName}/{documentId)', () => {
    afterEach(() => {
      documentClient.delete.restore();
    });

    it('should delete document record with the given ID', (done) => {
      // Arrange
      const expected = { id: '5' };

      sinon.stub(documentClient, 'delete').callsFake((params, callback) => {
        callback(undefined, expected);
      });

      // Act
      chai
        .request(app)
        .delete('/table/dynamoTable/5')
        .end((err, res) => {
          // Assert
          res.should.have.status(200);
          res.body.id.should.equal(expected.id);
          done();
        });
    });

    it('should return a 405 if DynamoDB has an error', (done) => {
      // Arrange
      sinon.stub(documentClient, 'delete').callsFake((params, callback) => {
        callback({}, undefined);
      });

      // Act
      chai
        .request(app)
        .delete('/table/dynamoTable/5')
        .send('"fruit":"banana"')
        .end((err, res) => {
          // Assert
          res.should.have.status(405);
          done();
        });
    });
  });

  describe('PUT: /table/{tableName}/{documentId)', () => {
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
        .put('/table/dynamoTable/5')
        .send('"fruit":"banana"')
        .end((err, res) => {
          // Assert
          res.should.have.status(200);
          res.body.id.should.exist;
          done();
        });
    });

    it('should return a 405 if DynamoDB has an error', (done) => {
      // Arrange
      sinon.stub(documentClient, 'put').callsFake((params, callback) => {
        callback({}, undefined);
      });

      // Act
      chai
        .request(app)
        .put('/table/dynamoTable/5')
        .send('"fruit":"banana"')
        .end((err, res) => {
          // Assert
          res.should.have.status(405);
          done();
        });
    });
  });
});

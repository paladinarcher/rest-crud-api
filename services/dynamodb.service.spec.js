// Import the dependencies for testing
const chai = require('chai');
const chaiHttp = require('chai-http');
const sinon = require('sinon');

const dynamoService = require('./dynamodb.service');

// Configure chai
chai.use(chaiHttp);
chai.should();

describe('DynamodbService', () => {
  // The DynamoDB DocumentClient
  let documentClient;

  beforeEach(() => {
    // Reset the DynamoDB DocumentClient
    documentClient = dynamoService.getDocumentClient();
  });

  describe('getDocumentsFromTable', () => {
    afterEach(() => {
      documentClient.scan.restore();
    });

    it('should get all document records from DynamoDB', async () => {
      try {
        // Arrange
        const expected = {
          Items: [{ id: 5 }, { id: 6 }],
        };
        sinon.stub(documentClient, 'scan').callsFake((params, callback) => {
          callback(undefined, expected);
        });

        // Act
        actual = await dynamoService.getDocumentsFromTable('documents');

        // Assert
        actual.length.should.equal(expected.Items.length);
        actual[0].id.should.equal(expected.Items[0].id);
        actual[1].id.should.equal(expected.Items[1].id);
      } catch (e) {
        chai.assert.fail('Failed to return the Dynamo data');
      }
    });

    it('should return errors from DynamoDB', async () => {
      const expected = {
        error: { id: 6, text: 'error text' },
      };
      try {
        // Arrange
        sinon.stub(documentClient, 'scan').callsFake((params, callback) => {
          callback(expected, undefined);
        });

        // Act
        actual = await dynamoService.getDocumentsFromTable('documents');

        // Assert
        chai.assert.fail('Failed to return the Dynamo ERROR');
      } catch (e) {
        e.error.id.should.equal(expected.error.id);
        e.error.text.should.equal(expected.error.text);
      }
    });
  });

  describe('getDocumentFromTable', () => {
    afterEach(() => {
      documentClient.get.restore();
    });

    it('should get document record from DynamoDB with the given ID', async () => {
      try {
        // Arrange
        const expected = { id: 5 };
        const valueMock = {
          Item: expected,
        };

        sinon.stub(documentClient, 'get').callsFake((params, callback) => {
          callback(undefined, valueMock);
        });

        // Act
        actual = await dynamoService.getDocumentFromTable(
          'documents',
          expected.id
        );

        // Assert
        actual.id.should.equal(expected.id);
      } catch (e) {
        chai.assert.fail('Failed to return the Dynamo data');
      }
    });

    it('should return errors from DynamoDB', async () => {
      const expected = {
        error: { id: 6, text: 'error text' },
      };
      try {
        // Arrange
        sinon.stub(documentClient, 'get').callsFake((params, callback) => {
          callback(expected, undefined);
        });

        // Act
        actual = await dynamoService.getDocumentFromTable('documents');

        // Assert
        chai.assert.fail('Failed to return the Dynamo data');
      } catch (e) {
        e.error.id.should.equal(expected.error.id);
        e.error.text.should.equal(expected.error.text);
      }
    });
  });

  describe('addDocumentToTable', () => {
    afterEach(() => {
      documentClient.put.restore();
    });

    it("should save a document and return it's ID", async () => {
      try {
        // Arrange
        document = { stuff: 'test_stuff' };
        sinon.stub(documentClient, 'put').callsFake((params, callback) => {
          callback(undefined, {});
        });

        // Act
        actual = await dynamoService.addDocumentToTable('documents', document);

        // Assert
        actual.id.should.exist;
      } catch (e) {
        chai.assert.fail('Failed to return documentId');
      }
    });

    it('should return errors from DynamoDB', async () => {
      const expected = {
        error: { id: 6, text: 'error text' },
      };
      try {
        // Arrange
        document = { stuff: 'test_stuff' };
        sinon.stub(documentClient, 'put').callsFake((params, callback) => {
          callback(expected, undefined);
        });

        // Act
        actual = await dynamoService.addDocumentToTable('documents', document);

        // Assert
        chai.assert.fail('Failed to return the document id');
      } catch (e) {
        e.error.id.should.equal(expected.error.id);
        e.error.text.should.equal(expected.error.text);
      }
    });
  });

  describe('deleteDocumentFromTable', () => {
    afterEach(() => {
      documentClient.delete.restore();
    });

    it('should delete document record from DynamoDB with the given ID', async () => {
      try {
        // Arrange
        const expected = { id: 5 };

        sinon.stub(documentClient, 'delete').callsFake((params, callback) => {
          callback(undefined, expected);
        });

        // Act
        actual = await dynamoService.deleteDocumentFromTable(
          'documents',
          expected.id
        );

        // Assert
        actual.id.should.equal(expected.id);
      } catch (e) {
        chai.assert.fail('Failed to return the Dynamo data');
      }
    });

    it('should return errors from DynamoDB', async () => {
      const expected = {
        error: { id: 6, text: 'error text' },
      };
      try {
        // Arrange
        sinon.stub(documentClient, 'delete').callsFake((params, callback) => {
          callback(expected, undefined);
        });

        // Act
        actual = await dynamoService.deleteDocumentFromTable('documents');

        // Assert
        chai.assert.fail('Failed to delete the Dynamo data');
      } catch (e) {
        e.error.id.should.equal(expected.error.id);
        e.error.text.should.equal(expected.error.text);
      }
    });
  });

  describe('updateDocumentInTable', () => {
    afterEach(() => {
      documentClient.put.restore();
    });

    it("should save a document and return it's ID", async () => {
      try {
        // Arrange
        document = { stuff: 'test_stuff' };
        documentId = 'Apple';
        sinon.stub(documentClient, 'put').callsFake((params, callback) => {
          callback(undefined, {});
        });

        // Act
        actual = await dynamoService.updateDocumentInTable(
          'documents',
          documentId,
          document
        );

        // Assert
        actual.id.should.exist;
      } catch (e) {
        chai.assert.fail('Failed to return documentId');
      }
    });

    it('should return errors from DynamoDB', async () => {
      documentId = 'Apple';
      const expected = {
        error: { id: 6, text: 'error text' },
      };
      try {
        // Arrange
        document = { stuff: 'test_stuff' };
        sinon.stub(documentClient, 'put').callsFake((params, callback) => {
          callback(expected, undefined);
        });

        // Act
        actual = await dynamoService.updateDocumentInTable(
          'documents',
          documentId,
          document
        );

        // Assert
        chai.assert.fail('Failed to return the document id');
      } catch (e) {
        e.error.id.should.equal(expected.error.id);
        e.error.text.should.equal(expected.error.text);
      }
    });
  });
});

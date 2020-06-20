const DynamodbService = require('../services/dynamodb.service');

/**
 * The TableControler is used to handle logic being invoked by the table routes.
 */
TableController = {
  /**
   * Gets a list of documents from the table requested in the params.
   * The function doesn't have a return but will call the send function on the Express response object.
   * It will respond with a status of 200 for a successful request.
   * It will respond with a status of 404 for a failure from DynamoDB (typically means the table doesn't exsist).
   * It will respond with a status of 500 for a any other failure with the request.
   * @param {any} req The ExpressJS request object.
   * @param {any} res The ExpressJS response object.
   */
  getDocumentsFromTable: (req, res) => {
    try {
      // Make the call to DynamoDB
      DynamodbService.getDocumentsFromTable(req.params.tableName).then(
        (resp) => {
          // Success
          res.status(200).send(resp);
        },
        (error) => {
          // DynamoDB Failure (typically the table doesn't exsist).
          res.status(404).send('Document not found');
        }
      );
    } catch (error) {
      // Any failure not returned from DynamoDB.
      res.status(500).send(error);
    }
  },

  /**
   * Gets the document with the ID provided in the URL params from the table requested in the params.
   * The function doesn't have a return but will call the send function on the Express response object.
   * It will respond with a status of 200 for a successful request.
   * It will respond with a status of 404 for a failure from DynamoDB (typically means the table or ID don't exsist).
   * It will respond with a status of 500 for a any other failure with the request.
   * @param {any} req The ExpressJS request object.
   * @param {any} res The ExpressJS response object.
   */
  getDocumentFromTable: (req, res) => {
    try {
      // Make the call to DynamoDB
      DynamodbService.getDocumentFromTable(
        req.params.tableName,
        req.params.documentId
      ).then(
        (resp) => {
          // Success
          res.status(200).send(resp);
        },
        (error) => {
          // DynamoDB Failure (typically the table or id don't exsist).
          res.status(404).send('Document not found');
        }
      );
    } catch (error) {
      // Any failure not returned from DynamoDB.
      res.status(500).send(error);
    }
  },

  /**
   * Creates a new document using the object provided in the request body in the table requested in the params.
   * The function doesn't have a return but will call the send function on the Express response object.
   * It will respond with a status of 200 for a successful request.
   * It will respond with a status of 405 for a failure from DynamoDB (typically means there was an issue with the creating
   *     the record in the DB like the table doesn't exsist or malformed json in the body).
   * It will respond with a status of 500 for a any other failure with the request.
   * @param {any} req The ExpressJS request object.
   * @param {any} res The ExpressJS response object.
   */
  addDocumentToTable: (req, res) => {
    try {
      // Make the call to DynamoDB
      DynamodbService.addDocumentToTable(req.params.tableName, req.body).then(
        (resp) => {
          // Success
          res.status(200).send(resp);
        },
        (error) => {
          // DynamoDB Failure (typically the table doesn't exsist).
          res.status(405).send('Invalid input');
        }
      );
    } catch (error) {
      // Any failure not returned from DynamoDB.
      res.status(500).send(error);
    }
  },

  /**
   * Deletes the document with the ID provided in the URL params from the table requested in the params.
   * The function doesn't have a return but will call the send function on the Express response object.
   * It will respond with a status of 200 for a successful request.
   * It will respond with a status of 404 for a failure from DynamoDB (typically means the table doesn't exsist).
   * It will respond with a status of 500 for a any other failure with the request.
   * @param {any} req The ExpressJS request object.
   * @param {any} res The ExpressJS response object.
   */
  deleteDocumentFromTable: (req, res) => {
    try {
      // Make the call to DynamoDB
      DynamodbService.deleteDocumentFromTable(
        req.params.tableName,
        req.params.documentId
      ).then(
        (resp) => {
          // Success
          res.status(200).send(resp);
        },
        (error) => {
          // DynamoDB Failure (typically the table or id don't exsist).
          res.status(404).send('Document not found');
        }
      );
    } catch (error) {
      // Any failure not returned from DynamoDB.
      res.status(500).send(error);
    }
  },

  /**
   * Updates a document using the object provided in the request body in the table requested in the params.
   * The function doesn't have a return but will call the send function on the Express response object.
   * It will respond with a status of 200 for a successful request.
   * It will respond with a status of 405 for a failure from DynamoDB (typically means there was an issue with the creating
   *     the record in the DB like the table doesn't exsist or malformed json in the body).
   * It will respond with a status of 500 for a any other failure with the request.
   * @param {any} req The ExpressJS request object.
   * @param {any} res The ExpressJS response object.
   */
  updateDocumentInTable: (req, res) => {
    try {
      // Make the call to DynamoDB
      DynamodbService.updateDocumentInTable(
        req.params.tableName,
        req.params.documentId,
        req.body
      ).then(
        (resp) => {
          // Success
          res.status(200).send(resp);
        },
        (error) => {
          // DynamoDB Failure (typically the table doesn't exsist).
          res.status(405).send('Document not found');
        }
      );
    } catch (error) {
      // Any failure not returned from DynamoDB.
      res.status(500).send(error);
    }
  },
};

module.exports = TableController;

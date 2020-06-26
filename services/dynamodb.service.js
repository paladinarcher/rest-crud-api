const AWS = require('aws-sdk');
const uuid = require('uuid');

// Configure the AWS SDK
dynamodb = new AWS.DynamoDB.DocumentClient({
  apiVersion: '2012-08-10',
  region: process.env.AWS_REGION,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});
// Documentation for the AWS SDK DynamoDB.DocumentClient:
// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DynamoDB/DocumentClient.html

/**
 * Builds the DynamoDB FilterExpression string and ExpressionAttributeValues object from a list of filters.
 * @param {{key: string, value: string}[]} filters The filters to scan DynamoDB with.
 * @return {{filterExpression: string, expressionAttributeValues: Object.<string, number|boolean>}} The DynamoDB FilterExpression and ExpressionAttributeValues.
 */
getDynamodbFilters = (filters) => {
  // The Filter Expression we are building.
  let filterExpression = '';
  const attributeValues = {};

  // Itterate over the filters.
  filters.forEach((filter, i) => {
    console.log(filter);
    // Keep track of the filter we are buildin to add to the expression.
    let stringToAdd = '';

    // Add the comma and space if it isn't the first filter.
    if (!!i) {
      stringToAdd += ' AND ';
    }

    // The Attribute key.
    const attributeKey = `:${filter.key}`;

    // Create an filter.
    stringToAdd += `${filter.key}=${attributeKey}`;

    // Add the filter string to the expression.
    filterExpression += stringToAdd;

    // Add the Attribute Value.
    attributeValues[attributeKey] = isNaN(filter.value)
      ? filter.value
      : +filter.value;
  });

  return {
    filterExpression: filterExpression,
    expressionAttributeValues: attributeValues,
  };
};

/**
 * The DynamodbService is used to handle logic involving interactions with DynamoDB.
 */
DynamodbService = {
  /**
   * Gets a list of documents from the table requested in the params.
   * @param {string} tableName The name of the table to operate against.
   * @param {{key: string, value: string}[]} filters The filters to scan DynamoDB with.
   * @return {Promise} If resolved it will hold a JSON list of the documents in the table. If rejected it will return the DynamoDB error.
   */
  getDocumentsFromTable: (tableName, filters) => {
    // paramaters for the DynamoDB scan request.
    const params = {
      TableName: tableName,
    };

    if (filters.length > 0) {
      const computedFilters = getDynamodbFilters(filters);
      params.FilterExpression = computedFilters.filterExpression;
      params.ExpressionAttributeValues =
        computedFilters.expressionAttributeValues;
    }

    // Return a promise because calls to DynamoDB are asynchronous.
    return new Promise((resolve, reject) => {
      dynamodb.scan(params, (err, data) => {
        if (err) {
          // DynamoDB Error (typically the table doesn't exsist).
          reject(err);
        } else {
          // DynamoDB successfully performed the operation.
          resolve(data.Items);
        }
      });
    });
  },

  /**
   * Gets the document with the given ID from the table with the given name.
   * @param {string} tableName The name of the table to operate against.
   * @param {string} documentId The id of the document to get.
   * @return {Promise} If resolved it will hold a the document from the table. If rejected it will return the DynamoDB error.
   */
  getDocumentFromTable: (tableName, documentId) => {
    // paramaters for the DynamoDB get request.
    const params = {
      Key: {
        id: documentId,
      },
      TableName: tableName,
    };

    // Return a promise because calls to DynamoDB are asynchronous.
    return new Promise((resolve, reject) => {
      dynamodb.get(params, (err, data) => {
        if (err) {
          // DynamoDB Error (typically the table or id don't exsist).
          reject(err);
        } else {
          // DynamoDB successfully performed the operation.
          resolve(data.Item);
        }
      });
    });
  },

  /**
   * Adds the given document to the table with the given name.
   * @param {string} tableName The name of the table to operate against.
   * @param {any} document The document to save.
   * @return {Promise} If resolved it will hold JSON with the new document's ID. If rejected it will return the DynamoDB error.
   */
  addDocumentToTable: (tableName, document) => {
    // Generate an ID to save the new document with.
    const documentId = uuid.v4();

    // paramaters for the DynamoDB put request.
    const docToAdd = {
      Item: {
        ...document,
        id: documentId,
      },
      TableName: tableName,
    };

    // Return a promise because calls to DynamoDB are asynchronous.
    return new Promise((resolve, reject) => {
      dynamodb.put(docToAdd, (err, data) => {
        if (err) {
          // DynamoDB Error (typically the table doesn't exsist).
          reject(err);
        } else {
          // DynamoDB successfully performed the operation.
          resolve({ id: documentId });
        }
      });
    });
  },

  /**
   * Deletes the document with the given ID from the table with the given name.
   * @param {string} tableName The name of the table to operate against.
   * @param {string} documentId The ID of the document to delete.
   * @return {Promise} If resolved it will hold JSON with the deleted document's ID. If rejected it will return the DynamoDB error.
   */
  deleteDocumentFromTable: (tableName, documentId) => {
    // paramaters for the DynamoDB delete request.
    const docToDelete = {
      Key: { id: documentId },
      TableName: tableName,
    };

    // Return a promise because calls to DynamoDB are asynchronous.
    return new Promise((resolve, reject) => {
      dynamodb.delete(docToDelete, (err, data) => {
        if (err) {
          // DynamoDB Error (typically the table or id don't exsist).
          reject(err);
        } else {
          // DynamoDB successfully performed the operation.
          resolve({ id: documentId });
        }
      });
    });
  },

  /**
   * Updates the document with the given ID to be the new document in the table with the given name.
   * @param {string} tableName The name of the table to operate against
   * @param {string} documentId The ID of the document to delete.
   * @param {any} document The document to save.
   * @return {Promise} If resolved it will hold JSON with the updated document's ID. If rejected it will return the DynamoDB error.
   */
  updateDocumentInTable: (tableName, documentId, document) => {
    // paramaters for the DynamoDB put request.
    const docToUpdate = {
      Item: {
        ...document,
        id: documentId,
      },
      TableName: tableName,
    };

    // Return a promise because calls to DynamoDB are asynchronous.
    return new Promise((resolve, reject) => {
      dynamodb.put(docToUpdate, (err, data) => {
        if (err) {
          // DynamoDB Error (typically the table doesn't exsist).
          reject(err);
        } else {
          // DynamoDB successfully performed the operation.
          resolve({ id: documentId });
        }
      });
    });
  },

  /**
   * Gets the DynamoDb Document Client to facilitate testing.
   * @return {any} The DynamoDb Document Client.
   */
  getDocumentClient: () => {
    return dynamodb;
  },

  /**
   * Builds the DynamoDB FilterExpression string and ExpressionAttributeValues object from a list of filters.
   * @param {{key: string, value: string}[]} filters The filters to scan DynamoDB with.
   * @return {{filterExpression: string, expressionAttributeValues: Object.<string, number|boolean>}} The DynamoDB FilterExpression and ExpressionAttributeValues.
   */
  getDynamodbFilters: (filters) => getDynamodbFilters(filters),
};

module.exports = DynamodbService;

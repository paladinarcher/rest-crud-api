const AWS = require('aws-sdk');
const uuid = require('uuid');

dynamodb = new AWS.DynamoDB.DocumentClient({
  apiVersion: '2012-08-10',
  // endpoint: 'http://127.0.0.1:8000',
  region: 'us-west-2',
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
});

DynamodbService = {
  getDocumentsFromTable: (tableName) => {
    var params = {
      TableName: tableName
     };

     return new Promise((resolve, reject) => {
       dynamodb.scan(params, (err, data) => {
        if (err) {
          reject(err);
        } else {
          resolve(data.Items);
        }
       })
     });
  },

  getDocumentFromTable: (tableName, documentId) => {
    var params = {
      Key: {
        id: documentId
      },
      TableName: tableName
     };

     return new Promise((resolve, reject) => {
       dynamodb.get(params, (err, data) => {
        if (err) {
     reject(err);
        } else {
          resolve(data.Item);
        }
       })
     });
  },

  addDocumentToTable: (tableName, document) => {
    const documentId = uuid.v4();
    const converted = {
      ...document,
      id: documentId
    };

    const docToAdd = {
      Item: converted,
      TableName: tableName
    };

    return new Promise((resolve, reject) => {
      dynamodb.put(docToAdd, (err, data) => {
        if (err) {
          reject(err);
        } else {
          resolve({id: documentId});
        }
      });
    });
  },

  getDocumentClient: () => {
    return dynamodb;
  }
  
}

module.exports = DynamodbService;

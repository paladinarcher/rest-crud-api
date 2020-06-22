const router = require('express');
const TableController = require('../controllers/table.controller');

const routes = router();

// Get a list of documents from the DB table in the param
routes.get('/:tableName', TableController.getDocumentsFromTable);

// Get a document from the DB table in the param with the ID in the param
routes.get('/:tableName/:documentId', TableController.getDocumentFromTable);

// Create a document in the DB table in the param
routes.post('/:tableName', TableController.addDocumentToTable);

// Delete the document from the DB table in the param with the ID in the param
routes.delete(
  '/:tableName/:documentId',
  TableController.deleteDocumentFromTable
);

// Update the document from the DB table in the param with the ID in the param
routes.put('/:tableName/:documentId', TableController.updateDocumentInTable);

module.exports = routes;

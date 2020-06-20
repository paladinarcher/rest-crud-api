const router = require('express');
const TableController = require('../controllers/table.controller');

const routes = router();

routes.get('/:tableName', TableController.getDocumentsFromTable);
routes.get('/:tableName/:documentId', TableController.getDocumentFromTable);
routes.post('/:tableName', TableController.addDocumentToTable);
routes.delete(
  '/:tableName/:documentId',
  TableController.deleteDocumentFromTable
);
routes.put('/:tableName/:documentId', TableController.updateDocumentInTable);

module.exports = routes;

const router = require('express');
const DocumentsController = require('../controllers/documents.controller');

const routes = router();

routes.get('/', DocumentsController.getDocumentsFromTable);
routes.get('/:documentId', DocumentsController.getDocumentFromTable);
routes.post('', DocumentsController.addDocumentToTable);

module.exports = routes;

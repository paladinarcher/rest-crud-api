const router = require('express');
const swaggerUi = require('swagger-ui-express');
const yaml = require('yamljs');
const swaggerDocument = yaml.load('./swagger.yaml');

const routes = router();

routes.get('/', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

module.exports = routes;

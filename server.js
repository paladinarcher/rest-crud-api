const express = require('express');
const swaggerUi = require('swagger-ui-express');
const yaml = require('yamljs');
const bodyParser = require('body-parser');
const tableRoutes = require('./routes/table.routes');
const cors = require('cors');
const swaggerDocument = yaml.load('./swagger.yaml');

const config = {
  name: 'sample-express-app',
  port: 3000,
  host: '0.0.0.0',
};

const app = express();

app.use(bodyParser.json());
app.use(cors());
// Send all requests to the 'table' route to the table.routes file to be resolved.
app.use('/table', tableRoutes);
app.get('/', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.listen(config.port, config.host, (e) => {
  if (e) {
    throw new Error('Internal Server Error');
  }
});

module.exports = app;

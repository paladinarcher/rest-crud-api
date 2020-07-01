const express = require('express');
const bodyParser = require('body-parser');
const tableRoutes = require('./routes/table.routes');
const swaggerRoutes = require('./routes/swagger.routes');
const cors = require('cors');

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
app.use(swaggerRoutes);

app.listen(config.port, config.host, (e) => {
  if (e) {
    throw new Error('Internal Server Error');
  }
});

module.exports = app;

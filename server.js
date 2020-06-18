const express = require('express');
const bodyParser = require('body-parser');
const documentsRoutes = require('./routes/documents.routes');
const cors = require('cors');

const config = {
  name: 'sample-express-app',
  port: 3000,
  host: '0.0.0.0',
};

const app = express();

app.use(bodyParser.json());
app.use(cors());
app.use('/documents', documentsRoutes);

app.listen(config.port, config.host, (e) => {
  if (e) {
    throw new Error('Internal Server Error');
  }
});

module.exports = app;

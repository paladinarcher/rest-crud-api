const router = require('express');

const routes = router();

routes.get('/', function (req, res) {
  res.send('pong');
});

module.exports = routes;

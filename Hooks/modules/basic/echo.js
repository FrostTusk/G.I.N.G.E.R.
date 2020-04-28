const logging = require('../../middleware/logging.js');

module.exports = function (app) {
  app.get('/echo', (req, res) => {
      logging.myLog({message: JSON.stringify(req.body), source: 'grappler'});
      res.send(JSON.stringify(req.body));
  });

  app.post('/echo', (req, res) => {
      logging.myLog({message: JSON.stringify(req.body), source: 'grappler'});
      res.send(JSON.stringify(req.body));
  });
}

const logging = require('../../middleware/logging.js');

module.exports = function (app) {
  app.post('/echo', (req, res) => {
      logging.myLog({message: req.body, source: 'grappler'});
      res.sendStatus(200);
  });

  app.get('/echo', (req, res) => {
      logging.myLog({message: req.body, source: 'grappler'});
      res.sendStatus(200);
  });
}

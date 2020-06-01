const fs = require('fs');
const net = require('net');
const logging = require('../../middleware/logging.js');

module.exports = function (app) {
  function sendDataToStaurois(config) {
    var opts = {
      host: config.host,
      port: config.port
    }

    var username = config.username;
    var password = config.password;
    var auth = 'Basic ' + Buffer.from(username + ':' + password).toString('base64');

    var socket = net.connect(opts, function() {
      socket.end('GET ' + config.endpoint + ' HTTP/1.0\r\n' +
                'Authorization: ' + auth + '\r\n' + '\r\n');
    });

    socket.on('data', function(chunk) {
      str = chunk.toString();
      str = str.replace(/\r?\n|\r/g, '\\n');

      logging.myLog({message: str, source: 'staurois'});
    });
  }


  app.post('/staurois', (req, res) => {
      //context = root of Hooks
      let obj = JSON.parse(fs.readFileSync('tricks/staurois/staurois.json', 'utf8'));

      if (req.body.secret != obj['secret']) {
        logging.myLog({message: 'Wrong Secret', source: 'command'})
        res.sendStatus(403);
        return;
      }

      let config, message;

      if (req.body.arm) {
        config = obj['arm'];
        message = 'received request for arming staurois';
      } else {
        config = obj['disarm'];
        message = 'received request for disarming staurois';
      }

      logging.myLog({message: message, source: 'command'})
      sendDataToStaurois(config)
      res.sendStatus(200);
  })
}

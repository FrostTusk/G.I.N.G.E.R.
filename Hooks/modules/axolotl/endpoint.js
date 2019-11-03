const fs = require('fs');
const net = require('net');

module.exports = function (app) {
  app.post('/axolotl', (req, res) => {
      // context = root of Hooks
      var obj = JSON.parse(fs.readFileSync('modules/axolotl/AXOLOTL.json', 'utf8'));
      var config;

      if (req.body.arm)
        config = obj["arm"];
      else
        config = obj["disarm"];

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
      console.log(chunk.toString());
    });

    res.end("yes");
  })
}

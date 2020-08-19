const HTTPInputTunnel = require('../obstacles/tunnels/HTTPInputTunnel.js');
const HTTPOutputTunnel = require('../obstacles/tunnels/HTTPOutputTunnel.js');


module.exports = class Ginger {
  constructor() {
    this.tunnels = [];
  }

  // Load in create tunnel methods
  createHTTPInputTunnel(options, inputMood, authenticationHurdle, authMood) {
    // create express
    if (!this._httpServer) {
      let express = require('express');
      this._httpServer = express();
      this._httpServer.use(express.json());
      this._httpServer.listen(options.port, options.hostname);
    }

    let tunnel = new HTTPInputTunnel(this._httpServer, options, inputMood,
      authenticationHurdle, authMood);
    this.tunnels.push(tunnel);
    return tunnel;
  }

  createHTTPOutputTunnel(options, outputMood, authenticationHurdle, authMood) {
    let tunnel = new HTTPOutputTunnel(options, outputMood, authenticationHurdle, authMood);
    return tunnel;
  }
}

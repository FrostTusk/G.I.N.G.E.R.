class Ginger {
  constructor() {
    this.tunnels = [];
  }

  // Load in create tunnel methods
  createHTTPInputTunnel(endpoint, authenticationHurdle, logging) {
    // create express
    if (!this._httpServer) {
      this._httpServer = require('express')();
      this._httpServer.use(express.json());
    }
    let tunnel = new HTTPInputTunnel(_httpServer, endpoint, authenticationHurdle);
    this.tunnels.add(tunnel);
    return tunnel;
  }
}

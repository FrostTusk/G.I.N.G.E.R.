const HTTPInputTunnel = require('../obstacles/tunnels/HTTPInputTunnel.js');
const HTTPOutputTunnel = require('../obstacles/tunnels/HTTPOutputTunnel.js');
const HDMICECTVTrick = require('../tricks/testTrick.js');

const { CEC, CECMonitor } = require("@senzil/cec-monitor");

module.exports = class Ginger {
  constructor() {
    this.tunnels = [];
  }

  createHDMICECTVTrick(tv_name,
    turnOnInputTunnels, turnOffInputTunnels, switchSourceInputTunnels,
    stateOnListenerOutputTunnels, stateOffListenerOutputTunnels, switchSourceListenerOutputTunnels) {

    let monitor = new CECMonitor("G.I.N.G.E.R.", {});
    HDMICECTVTrick(tv_name, monitor,
      turnOnInputTunnels, turnOffInputTunnels, switchSourceInputTunnels,
      stateOnListenerOutputTunnels, stateOffListenerOutputTunnels, switchSourceListenerOutputTunnels
    )
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
    console.log(this.tunnels);
    console.log(this._httpServer._router.stack);
    return tunnel;
  }

  createHTTPOutputTunnel(options, outputMood, authenticationHurdle, authMood) {
    let tunnel = new HTTPOutputTunnel(options, outputMood, authenticationHurdle, authMood);
    return tunnel;
  }
}

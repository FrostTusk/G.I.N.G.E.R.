const HTTPInputTunnel = require('../obstacles/tunnels/HTTPInputTunnel.js');
const HTTPOutputTunnel = require('../obstacles/tunnels/HTTPOutputTunnel.js');
const MyLogLogOutputTunnel = require('../obstacles/tunnels/MyLogLogOutputTunnel.js');
const { CEC, CECMonitor } = require('@senzil/cec-monitor');

module.exports = class Ginger {
  constructor(log) {
    if (log)
      this._logTunnel = this.createMyLogLogOutputTunnel('G.I.N.G.E.R.')

    if (this._logTunnel) this._logTunnel.emit('initialized', ['core']);
  }

  createHDMICECTVTrick(tv_name,
    turnOnInputTunnels, turnOffInputTunnels, switchSourceInputTunnels,
    stateOnListenerOutputTunnels, stateOffListenerOutputTunnels, switchSourceListenerOutputTunnels) {
    if (!this.HDMICECTVTrick) {
      if (this._logTunnel) this._logTunnel.emit('loaded in HDMICECTVTrick', ['core', 'tricks']);
      this.HDMICECTVTrick = require('../tricks/HDMICECTVTrick.js');
    }

    let monitor = new CECMonitor('G.I.N.G.E.R.', {});

    if (this._logTunnel) this._logTunnel.emit('created new HDMICECTVTrick', ['core', 'tricks']);
    return this.HDMICECTVTrick(tv_name, monitor,
      turnOnInputTunnels, turnOffInputTunnels, switchSourceInputTunnels,
      stateOnListenerOutputTunnels, stateOffListenerOutputTunnels, switchSourceListenerOutputTunnels
    )
  }

  createFilewatchTrick(watch, outputTunnels, trickMood, recursive) {
    if (!this.Filewatch) {
      if (this._logTunnel) this._logTunnel.emit('loaded in FilewatchTrick', ['core', 'tricks']);
      this.Filewatch = require('../tricks/Filewatch.js');
    }
    if (this._logTunnel) this._logTunnel.emit('created new FilewatchTrick', ['core', 'tricks']);
    return this.Filewatch(watch, outputTunnels, trickMood, recursive);
  }

  // Load in create tunnel methods
  createHTTPInputTunnel(options, inputMood, authenticationHurdle, authMood, logTunnel) {
    // create express
    if (!this._httpServer) {
      let express = require('express');
      this._httpServer = express();
      this._httpServer.use(express.json());
      this._httpServer.listen(options.port, options.hostname);
    }

    let tunnel = new HTTPInputTunnel(this._httpServer, options, inputMood,
      authenticationHurdle, authMood, logTunnel);
    if (this._logTunnel) this._logTunnel.emit('created new HTTPInputTunnel', ['core', 'obstacles']);
    return tunnel;
  }

  createHTTPOutputTunnel(options, outputMood, authenticationHurdle, authMood) {
    let tunnel = new HTTPOutputTunnel(options, outputMood, authenticationHurdle, authMood);
    if (this._logTunnel) this._logTunnel.emit('created new HTTPOutputTunnel', ['core', 'obstacles']);
    return tunnel;
  }

  createMyLogLogOutputTunnel(source) {
    let tunnel = new MyLogLogOutputTunnel(source);
    if (this._logTunnel) this._logTunnel.emit('created new MyLogLogOutputTunnel', ['core', 'obstacles']);
    return tunnel;
  }
}

const { CEC, CECMonitor } = require('@senzil/cec-monitor');
const Seesaws = require('../seesaws')

module.exports = function (log) {
  return new Ginger(log);
}

class Ginger {
  constructor(log) {
    this.seesaws = Seesaws;
    
    if (log)
      this._logTunnel = this.createMyLogLogOutputTunnel('G.I.N.G.E.R.')

    if (this._logTunnel) this._logTunnel.emit('initialized', ['core', 'load']);
  }

  createHDMICECTVTrick(tv_name,
    turnOnInputTunnels, turnOffInputTunnels, switchSourceInputTunnels,
    stateOnListenerOutputTunnels, stateOffListenerOutputTunnels, switchSourceListenerOutputTunnels, logTunnel) {
    if (!this.HDMICECTVTrick) {
      this.HDMICECTVTrick = require('../tricks/HDMI-CEC-TVTrick.js');
      if (this._logTunnel) this._logTunnel.emit('loaded in HDMICECTVTrick', ['core', 'tricks', 'load']);
    }

    let monitor = new CECMonitor('G.I.N.G.E.R.', {});

    if (this._logTunnel) this._logTunnel.emit('created new HDMICECTVTrick', ['core', 'tricks', 'creation']);
    return this.HDMICECTVTrick(tv_name, monitor,
      turnOnInputTunnels, turnOffInputTunnels, switchSourceInputTunnels,
      stateOnListenerOutputTunnels, stateOffListenerOutputTunnels, switchSourceListenerOutputTunnels, logTunnel
    )
  }

  createFilewatchTrick(watch, outputTunnels, trickMood, recursive, logTunnel) {
    if (!this.Filewatch) {
      this.Filewatch = require('../tricks/Filewatch.js');
      if (this._logTunnel) this._logTunnel.emit('loaded in FilewatchTrick', ['core', 'tricks', 'load']);
    }
    if (this._logTunnel) this._logTunnel.emit('created new FilewatchTrick', ['core', 'tricks', 'creation']);
    return this.Filewatch(watch, outputTunnels, trickMood, recursive, logTunnel);
  }

  // Load in create tunnel methods
  createHTTPInputTunnel(options, inputMood, authenticationHurdle, authMood, logTunnel) {
    // create express
    if (!this.HTTPInputTunnel) {
      let express = require('express');
      this._httpServer = express();
      this._httpServer.use(express.json());
      this._httpServer.listen(options.port, options.hostname);
      if (this._logTunnel) this._logTunnel.emit('loaded in new http express server', ['core', 'obstacles', 'load']);

      this.HTTPInputTunnel = require('../obstacles/tunnels/HTTPInputTunnel.js');
      if (this._logTunnel) this._logTunnel.emit('loaded in HTTPInputTunnel', ['core', 'obstacles', 'load']);
    }

    let tunnel = new this.HTTPInputTunnel(this._httpServer, options, inputMood,
      authenticationHurdle, authMood, logTunnel);
    if (this._logTunnel) this._logTunnel.emit('created new HTTPInputTunnel', ['core', 'obstacles', 'creation']);
    return tunnel;
  }

  createHTTPOutputTunnel(options, outputMood, authenticationHurdle, authMood, logTunnel) {
    if (!this.HTTPOutputTunnel) {
      this.HTTPOutputTunnel = require('../obstacles/tunnels/HTTPOutputTunnel.js');
      if (this._logTunnel) this._logTunnel.emit('loaded in HTTPOutputTunnel', ['core', 'obstacles', 'load']);
    }

    let tunnel = new this.HTTPOutputTunnel(options, outputMood, authenticationHurdle, authMood, logTunnel);
    if (this._logTunnel) this._logTunnel.emit('created new HTTPOutputTunnel', ['core', 'obstacles', 'creation']);
    return tunnel;
  }

  createMyLogLogOutputTunnel(source) {
    if (!this.MyLogLogOutputTunnel) {
      this.MyLogLogOutputTunnel = require('../obstacles/tunnels/MyLogLogOutputTunnel.js');
      if (this._logTunnel) this._logTunnel.emit('loaded in MyLogLogOutputTunnel', ['core', 'obstacles', 'load']);
    }

    let tunnel = new this.MyLogLogOutputTunnel(source);
    if (this._logTunnel) this._logTunnel.emit('created new MyLogLogOutputTunnel', ['core', 'obstacles', 'creation']);
    return tunnel;
  }
}

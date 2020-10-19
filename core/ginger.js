const { CEC, CECMonitor } = require('@senzil/cec-monitor');

module.exports = function (log) {
  return new Ginger(log);
}

/**
* Represents the core G.I.N.G.E.R. object. This object takes of managing and maintaining
* the deployed G.I.N.G.E.R. instance.
* @property {object} _httpServers - A dictionary that maps ports onto HTTP Servers.
 */
class Ginger {
  /**
   * Create a new G.I.N.G.E.R. instance
   * @constructor
   * @param {boolean} log - Signifies whether or not G.I.N.G.E.R.
   * should use it's own log tunnel for logging system information.
   */
  constructor(log) {
    if (log)
      this._logTunnel = this.createMyLogLogOutputTunnel('G.I.N.G.E.R.')

    if (this._logTunnel) this._logTunnel.emit('initialized', ['core', 'load']);
  }

  /**
   * Creates a new HDMICECTVTrick and performs internal bookkkeeping.
   * @see {@link HDMICECTVTrick}
   */
  createHDMICECTVTrick(
    turnOnInputTunnels, turnOffInputTunnels, switchSourceInputTunnels,
    stateOnListenerOutputTunnels, stateOffListenerOutputTunnels, switchSourceListenerOutputTunnels, logTunnel) {
    if (!this.HDMICECTVTrick) {
      this.HDMICECTVTrick = require('../tricks/HDMI-CEC-TVTrick.js');
      if (this._logTunnel) this._logTunnel.emit('loaded in HDMICECTVTrick', ['core', 'tricks', 'load']);
    }

    let monitor = new CECMonitor('G.I.N.G.E.R.', {});

    if (this._logTunnel) this._logTunnel.emit('created new HDMICECTVTrick', ['core', 'tricks', 'creation']);
    return new this.HDMICECTVTrick(monitor,
      turnOnInputTunnels, turnOffInputTunnels, switchSourceInputTunnels,
      stateOnListenerOutputTunnels, stateOffListenerOutputTunnels, switchSourceListenerOutputTunnels, logTunnel
    )
  }

  /**
   * Creates a new FilewatchTrick and performs internal bookkkeeping.
   * @see {@link FilewatchTrick}
   */
  createFilewatchTrick(watch, outputTunnels, trickMood, recursive, logTunnel) {
    if (!this.Filewatch) {
      this.Filewatch = require('../tricks/Filewatch.js');
      if (this._logTunnel) this._logTunnel.emit('loaded in FilewatchTrick', ['core', 'tricks', 'load']);
    }
    if (this._logTunnel) this._logTunnel.emit('created new FilewatchTrick', ['core', 'tricks', 'creation']);
    return new this.Filewatch(watch, outputTunnels, trickMood, recursive, logTunnel);
  }

  /**
   * Creates a new HTTPInputTunne and performs internal bookkkeeping.
   * @see {@link HTTPInputTunne}
   */
  createHTTPInputTunnel(options, inputMood, authenticationHurdle, authMood, logTunnel, http_uses) {
    if (!this.HTTPInputTunnel) {
      this._httpServers = {};
      this.HTTPInputTunnel = require('../obstacles/tunnels/HTTPInputTunnel.js');
      if (this._logTunnel) this._logTunnel.emit('loaded in HTTPInputTunnel', ['core', 'obstacles', 'load']);
    }

    if (!this._httpServers[options.port]) {
      this._httpServers[options.port] = require('express')();
      this._httpServers[options.port].listen(options.port, options.hostname);
      if (this._logTunnel) this._logTunnel.emit('loaded in new http express server on port ' + options.port, ['core', 'obstacles', 'load']);
    }

    for (let i in http_uses)
      this._httpServers[options.port].use(http_uses[i]);

    let tunnel = new this.HTTPInputTunnel(this._httpServers[options.port], options, inputMood,
      authenticationHurdle, authMood, logTunnel);
    if (this._logTunnel) this._logTunnel.emit('created new HTTPInputTunnel', ['core', 'obstacles', 'creation']);
    return tunnel;
  }

  /**
   * Creates a new HTTPOutputTunnel and performs internal bookkkeeping.
   * @see {@link HTTPOutputTunnel}
   */
  createHTTPOutputTunnel(options, outputMood, authenticationHurdle, authMood, logTunnel) {
    if (!this.HTTPOutputTunnel) {
      this.HTTPOutputTunnel = require('../obstacles/tunnels/HTTPOutputTunnel.js');
      if (this._logTunnel) this._logTunnel.emit('loaded in HTTPOutputTunnel', ['core', 'obstacles', 'load']);
    }

    let tunnel = new this.HTTPOutputTunnel(options, outputMood, authenticationHurdle, authMood, logTunnel);
    if (this._logTunnel) this._logTunnel.emit('created new HTTPOutputTunnel', ['core', 'obstacles', 'creation']);
    return tunnel;
  }

  /**
   * Creates a new HTTPSOutputTunnel and performs internal bookkkeeping.
   * @see {@link HTTPSOutputTunnel}
   */
  createHTTPSOutputTunnel(options, outputMood, authenticationHurdle, authMood, logTunnel) {
    if (!this.HTTPSOutputTunnel) {
      this.HTTPSOutputTunnel = require('../obstacles/tunnels/HTTPSOutputTunnel.js');
      if (this._logTunnel) this._logTunnel.emit('loaded in HTTPSOutputTunnel', ['core', 'obstacles', 'load']);
    }

    let tunnel = new this.HTTPSOutputTunnel(options, outputMood, authenticationHurdle, authMood, logTunnel);
    if (this._logTunnel) this._logTunnel.emit('created new HTTPSOutputTunnel', ['core', 'obstacles', 'creation']);
    return tunnel;
  }

  /**
   * Creates a new MyLogLogOutputTunnel and performs internal bookkkeeping.
   * @see {@link MyLogLogOutputTunnel}
   */
  createMyLogLogOutputTunnel(source) {
    if (!this.MyLogLogOutputTunnel) {
      this.MyLogLogOutputTunnel = require('../obstacles/tunnels/MyLogLogOutputTunnel.js');
      if (this._logTunnel) this._logTunnel.emit('loaded in MyLogLogOutputTunnel', ['core', 'obstacles', 'load']);
    }

    let tunnel = new this.MyLogLogOutputTunnel(source);
    if (this._logTunnel) this._logTunnel.emit('created new MyLogLogOutputTunnel', ['core', 'obstacles', 'creation']);
    return tunnel;
  }

  /**
   * Creates a new SMTPOutputTunnel and performs internal bookkkeeping.
   * @see {@link SMTPOutputTunnel}
   */
  createSMTPOutputTunnel(options, outputMood, authenticationHurdle, authMood, logTunnel, from) {
    if (!this.SMTPOutputTunnel) {
      this.SMTPOutputTunnel = require('../obstacles/tunnels/SMTPOutputTunnel.js');
      if (this._logTunnel) this._logTunnel.emit('loaded in SMTPOutputTunnel', ['core', 'obstacles', 'load']);
    }

    let tunnel = new this.SMTPOutputTunnel(options, outputMood, authenticationHurdle, authMood, logTunnel, from);
    if (this._logTunnel) this._logTunnel.emit('created new SMTPOutputTunnel', ['core', 'obstacles', 'creation']);
    return tunnel;
  }
}

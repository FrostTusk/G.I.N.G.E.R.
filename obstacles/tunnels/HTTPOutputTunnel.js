const http = require('http');
const OutputTunnel = require('./OutputTunnel.js');

module.exports = class HTTPOutputTunnel extends OutputTunnel {
  constructor(options, outputMood, authenticationHurdle, authMood, logTunnel) {
    super(options, outputMood, authenticationHurdle);
    this._options = options;
    this._outputMood = (outputMood) ? outputMood: function(data) {return data};
    this._authenticationHurdle = authenticationHurdle;
    this._authMood = (authMood) ? authMood: function() {};
    this._logTunnel = logTunnel;
    if (logTunnel) logTunnel.addTags(['HTTPOuttputTunnel']);
  }

  emit(data) {
    if (this._authenticationHurdle) {
      if (this._logTunnel) this._logTunnel.emit('received pre-authentication request', ['auth']);
      this._authenticationHurdle.guard(this._authMood(data));
    }

    let finalData = this._outputMood(data);
    if (this._logTunnel) this._logTunnel.emit('path: ' + this._options.path + ' data: ' + JSON.stringify(finalData));

    let request = new http.ClientRequest(this._options);
    request.end(finalData);
  }
};

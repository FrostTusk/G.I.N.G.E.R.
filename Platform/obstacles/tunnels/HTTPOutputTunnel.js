const http = require('http');
const OutputTunnel = require('./OutputTunnel.js');

module.exports = class HTTPOutputTunnel extends OutputTunnel {
  constructor(options, outputMood, authenticationHurdle, authMood) {
    super(options, outputMood, authenticationHurdle);
    this._options = options;
    // this._options = {};
    // Object.assign(this._options, options);
    this._outputMood = outputMood;
    this._authenticationHurdle = authenticationHurdle;
    if (!authMood) {
      this._authMood = function() {};
    } else {
      this._authMood = authDH;
    }
  }

  emit(data) {
    if (this._authenticationHurdle)
      this._authenticationHurdle.guard(this._authMood(data));
    let request = new http.ClientRequest(this._options);
    request.end(this._outputMood(data));
  }
};

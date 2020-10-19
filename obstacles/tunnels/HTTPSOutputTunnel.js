const https = require('https');
const OutputTunnel = require('./OutputTunnel.js');

/**
 * An HTTPOutputTunnel that outputs data onto a specific HTTP Method/Path configuration.
 */
class HTTPSOutputTunnel extends OutputTunnel {
  /**
   * Options as defined by express.
   * @typedef HTTPSOutputTunnel~HTTPConfig
   * @type {object}
   */

  /**
   * Mood that takes the original to be outputted data and transforms it into data for the actual output tunnel procedure.
   * @callback HTTPSOutputTunnel~~OutputMood
   * @param {Object} data - original data.
   * @returns {Object} Data object to be used in the actual output tunnel.
   */

  /**
   * Mood that takes the original to be outputted data and transforms it into data for the authentication hurdle.
   * @callback HTTPSOutputTunnel~~AuthMood
   * @param {Object} data - original data.
   * @returns {Object} Data object to be used by the authentication hurdle.
   */

  /**
   * Creates a new HTTPOutputTunnel.
   * @todo rename objects (logTunnel, authenticationHurdle)
   * @constructor
   * @param {HTTPSOutputunnel~HTTPConfig} options - Configuration for the HTTPS protocol.
   * @param {HTTPSOutputTunnel~OutputMood} outputMood - OutputMood to be used by the tunnel.
   * @param {Object} authenticationHurdle - Obstacle that authenticates every outgoing request.
   * @param {HTTPSOutputTunnel~AuthMood} AuthMood - to be used by the tunnel.
   * @param {Object} logTunnel - The logTunnel to be used.
   */
  constructor(options, outputMood, authenticationHurdle, authMood, logTunnel) {
    super(options, outputMood, authenticationHurdle);
    this._options = options;
    this._outputMood = (outputMood) ? outputMood: function(data) {return data};
    this._authenticationHurdle = authenticationHurdle;
    this._authMood = (authMood) ? authMood: function() {};
    this._logTunnel = logTunnel;
    if (logTunnel) logTunnel.addTags(['HTTPOuttputTunnel']);
  }

  /**
   * Forward given data onto the HTTPS output channel.
   * @param {Object} data - The actual data to be sent onto the channel.
   */
  emit(data) {
    if (this._authenticationHurdle) {
      if (this._logTunnel) this._logTunnel.emit('received pre-authentication request', ['auth']);
      this._authenticationHurdle.guard(this._authMood(data));
    }

    let finalData = this._outputMood(data);
    if (this._logTunnel) this._logTunnel.emit('path: ' + this._options.path + ' data: ' + JSON.stringify(finalData));

    let request = new https.request(this._options);
    request.end(finalData);
    return request;
  }
};

module.exports = HTTPSOutputTunnel;

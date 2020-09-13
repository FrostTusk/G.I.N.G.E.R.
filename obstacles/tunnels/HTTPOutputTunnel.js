const http = require('http');
const OutputTunnel = require('./OutputTunnel.js');

/**
 * An HTTPOutputTunnel that outputs data onto a specific HTTP Method/Path configuration.
 */
class HTTPOutputTunnel extends OutputTunnel {
  /**
   * Options as defined by express.
   * @typedef HTTPOutputTunnel~HTTPConfig
   * @type {object}
   */

  /**
   * Mood that takes the HTTP input (req, res) and transforms it into data for the actual output tunnel procedure.
   * @callback HTTPOutputTunnel~~OutputMood
   * @param {Object} req - express incoming HTTP request.
   * @param {Object} res - express incoming HTTP result.
   * @returns {Object} Data object to be used in the actual input tunnel.
   */

  /**
   * Mood that takes the HTTP input (req, res) and transforms it into data for the authentication hurdle.
   * @callback HTTPOutputTunnel~~AuthMood
   * @param {Object} req - express incoming HTTP request.
   * @param {Object} res - express incoming HTTP result.
   * @returns {Object} Data object to be used by the authentication hurdle.
   */

  /**
   * Creates a new HTTPOutputTunnel.
   * @todo rename objects (logTunnel, authenticationHurdle)
   * @constructor
   * @param {HTTPOutputunnel~HTTPConfig} options - Configuration for the HTTP protocol.
   * @param {HTTPOutputTunnel~OutputMood} outputMood - OutputMood to be used by the tunnel.
   * @param {Object} authenticationHurdle - Obstacle that authenticates every outgoing request.
   * @param {HTTPOutputTunnel~AuthMood} AuthMood - to be used by the tunnel.
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
   * Forward given data onto the HTTP output channel.
   * @param {Object} data - The actual data to be sent onto the channel.
   */
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

module.exports = HTTPOutputTunnel;

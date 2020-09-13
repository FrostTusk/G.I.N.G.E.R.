const InputTunnel = require('./InputTunnel.js');

/**
 * An HTTPInputTunnel allows for listening to a specifc HTTP Method/Path configuration.
 */
class HTTPInputTunnel extends InputTunnel {
  /**
   * @typedef HTTPInputTunnel~HTTPConfig
   * @type {object}
   * @property {string} path - The path that this tunnel will listen.
   * @property {string} method - The kind of HTTP method that this tunnel will use.
   */

   /**
    * Mood that takes the HTTP input (req, res) and transforms it into data for the actual input tunnel procedure.
    * @callback HTTPInputTunnel~~InputMood
    * @param {Object} req - express incoming HTTP request.
    * @param {Object} res - express incoming HTTP result.
    * @returns {Object} Data object to be used in the actual input tunnel.
    */

    /**
     * Mood that takes the HTTP input (req, res) and transforms it into data for the authentication hurdle.
     * @callback HTTPInputTunnel~~AuthMood
     * @param {Object} req - express incoming HTTP request.
     * @param {Object} res - express incoming HTTP result.
     * @returns {Object} Data object to be used by the authentication hurdle.
     */

    /**
     * Creates a new HTTPInputTunnel.
     * @todo refactor method, expand on authenticationHurdle
     * @constructor
     * @param {Object} app - Express server object.
     * @param {HTTPInputTunnel~InputMood} inputMood - Mood that takes the HTTP input (req, res) and transforms it into data for the actual input tunnel procedure.
     * @param {HTTPInputTunnel~HTTPConfig} options - Configuration for the HTTP protocol.
     * @param {Object} authenticationHurdle - Obstacle that authenticates every incoming request.
     * @param {HTTPInputTunnel~AuthMood} authMood - Mood that takes the HTTP input (req, res) and transforms it into data for the authentication hurdle.
     * @param {Object} logTunnel - The logTunnel to be used.
     */
    constructor(app, options, inputMood, authenticationHurdle, authMood, logTunnel) {
      super(app, options, authenticationHurdle, authMood, logTunnel);
      this._inputMood = (inputMood) ? inputMood:
        (req, res) => {return req.body};
      this._authMood = (authMood) ? authMood: function() {};
      this._logTunnel = logTunnel;

      if (logTunnel) logTunnel.addTags(['HTTPInputTunnel']);

      let inputFunction;
      if (authenticationHurdle) {
        inputFunction = (req, res) => {
          if (this._logTunnel) this._logTunnel.emit('received pre-authentication request', ['auth']);
          this._authenticationHurdle.guard(this._authMood(req, res));

          let data = this._inputMood(req, res);
          if (this._logTunnel) this._logTunnel.emit('path: ' + options.path + ' data: ' + JSON.stringify(data));
          this._procedure(data);
          res.sendStatus(200);
        }
      } else {
        inputFunction = (req, res) => {
          let data = this._inputMood(req, res);
          if (this._logTunnel) this._logTunnel.emit('path: ' + options.path + ' data: ' + JSON.stringify(data));
          this._procedure(data);
          res.sendStatus(200);
        }
      }

      switch(options.method.toUpperCase()) {
        case "POST":
          app.post(options.path, inputFunction);
          break;
        case "GET":
          app.get(options.path, inputFunction);
          break;
        default:
          throw "method not supported"
      }
    }
};

module.exports = HTTPInputTunnel;

const InputTunnel = require('./InputTunnel.js');

/**
 * An HTTPInputTunnel allows for listening to a specifc HTTP Method/Path configuration.
 */
class HTTPInputTunnel extends InputTunnel {
  /**
   * @typedef HTTPInputTunnel~HTTPConfig
   * @type {object}
   * @property {string} path - an ID.
   * @property {string} method - your name.
   */

   /**
    * Mood that takes the HTTP input (req, res) and transforms it into data for the actual input tunnel procedure.
    * @callback HTTPInputTunnel~~InputMood
    * @param {Object} req - express incoming HTTP request
    * @param {Object} res - express incoming HTTP result
    * @returns {Object} Data object to be used in the actual input tunnel.
    */

    /**
     * Creates a new HTTPInputTunnel.
     * @todo refactor method
     * @constructor
     * @param {Object} app - Express server object
     * @param {HTTPInputTunnel~InputMood} inputMood - stuff
     * @param {HTTPInputTunnel~HTTPConfig} options - Configuration for the HTTP protocol.
     * @param {} authenticationHurdle
     * @param {}
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

const InputTunnel = require('./InputTunnel.js');

module.exports = class HTTPInputTunnel extends InputTunnel {
    constructor(app, options, inputMood, authenticationHurdle, authMood) {
      super(app, options, authenticationHurdle, authMood);
      this._procedure = function() {throw "procedure not specified"};

      if (!inputMood) {
        this._inputMood = (req, res) => {return req.body};
      } else {
        this._inputMood = inputMood;
      }

      if (!authMood) {
        this._authMood = function() {};
      } else {
        this._authMood = authMood;
      }

      let inputFunction;
      if (authenticationHurdle) {
        inputFunction = (req, res) => {
          this._authenticationHurdle.guard(this._authMood(req, res));
          this._procedure(this._inputMood(req, res));
          res.sendStatus(200);
        }
      } else {
        inputFunction = (req, res) => {
          this._procedure(this._inputMood(req, res));
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

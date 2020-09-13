/**
 * An InputTunnel defines an incoming communication channel.
 * After creating the tunnel object, it is possible to register a procuedure to be called anytime
 * the tunnel is triggered.
 */
class InputTunnel {
  /**
   * Creates a new InputTunnel.
   * @constructor
   */
  constructor() {
    this._procedure = function() {throw "procedure not specified"};
  }

  /**
   * Processes the input data that was received via an InputTunnel.
   * @callback InputTunnel~ListenerProcedure
   * @param {Object} data
   */

  /**
   * Registers the procedure to be called whenever this tunnel is triggered.
   * (When it receives input)
   * @abstract
   * @param {InputTunnel~ListenerProcedure} - ListenerProcedure
   */
  on(procedure) {
    this._procedure = procedure;
  }
};

module.exports = InputTunnel;

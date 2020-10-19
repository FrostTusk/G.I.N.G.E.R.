/**
 * An InputTunnel defines an incoming communication channel.
 * After creating the tunnel object, it is possible to register a procedure to be called anytime
 * the tunnel is triggered.
 *
 * @module obstacles/tunnels
 */
class InputTunnel {
  /**
   * Creates a new InputTunnel.
   *
   * @class
   */
  constructor () {
    this._procedure = () => { throw new Error('procedure not specified'); };
  }

  /**
   * Processes the input data that was received via an InputTunnel.
   *
   * @callback InputTunnel~ListenerProcedure
   * @param {object} data - The received input data.
   */

  /**
   * Registers the procedure to be called whenever this tunnel is triggered.
   * (When it receives input).
   *
   * @abstract
   * @param {InputTunnel~ListenerProcedure} procedure - The procedure to be called.
   */
  on (procedure) {
    this._procedure = procedure;
  }
}

module.exports = InputTunnel;

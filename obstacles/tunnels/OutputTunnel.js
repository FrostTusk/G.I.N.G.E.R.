/**
 * An OutputTunnel defines an outgoing communication channel on which a component can send data.
 * After creating the tunnel object, any component can use the tunnel to forward data to other side of the tunnel
 *
 * @module obstacles/tunnels
 */
class OutputTunnel {
  /**
   * Creates a new OutputTunnel.
   * @constructor
   */
  constructor() {
  }

  /**
   * Forward given data onto the OutputTunnel channel.
   * @abstract
   * @param {Object} data - The actual data to be sent onto the channel.
   */
  emit(data) {
  }
};

module.exports = OutputTunnel;

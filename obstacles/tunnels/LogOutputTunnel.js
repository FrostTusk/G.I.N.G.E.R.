const OutputTunnel = require('./OutputTunnel.js');

/**
 * Performs an output on a logging system.
 *
 * @module obstacles/tunnels
 *
 * @property {object} _tags - The added information which should be outputted onto the tunnel.
 *                            Tags are used for sorting purposes.
 */
class LogOutputTunnel extends OutputTunnel {
  /**
   * Creates a new LogOutputTunnel.
   *
   * @class
   *
   * @param {string} source The source that wants to start logging.
   */
  constructor (source) {
    super();
    this._source = source;
    this._tags = [];
  }

  /**
   * Adds new tags to be added with every log message sent on this logTunnel.
   *
   * @param {string[]} tags The new tags to be added.
   */
  addTags (tags) {
    for (let tag in tags)
      this._tags.push(tags[tag]);
  }
};

module.exports = LogOutputTunnel;

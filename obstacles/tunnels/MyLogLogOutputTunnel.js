const moment = require('moment');
const LogOutputTunnel = require('./LogOutputTunnel.js');


/**
 * A log tunnel that outputs data in "my" format.
 *
 * @property {object} _source - The source of this logTunnel.
 */
class MyLogLogOutputTunnel extends LogOutputTunnel {
  /**
   * Creates a new MyLogLogOutputTunnel.
   *
   * @constructor
   * @param {string} source - The source of this logTunnel.
   */
  constructor(source) {
    super(source);
  }

  /**
   * This function will output a given event into an easily parsed log entry
   * using a formatted version of console.log.
   *
   * @param {Object} data - The data to be outputted.
   */
  emit(data, tags) {
    let timestamp = moment().format();
    let entry = timestamp + '; ';
    entry += this._source + '; ';
    entry += data + '; ';

    if ((!this._tags || this._tags.length == 0) &&
      (!tags || tags.length == 0)) {
      entry += '[]';
    } else {
      let fullTags = (tags) ? tags.concat(this._tags): this._tags;
      entry += '[';
      for (let i = 0; i < fullTags.length - 1; i++) {
        entry += fullTags[i] + ', ';
      }
      entry += fullTags[fullTags.length - 1] + ']';
    }

    console.log(entry);
  }
}

module.exports = MyLogLogOutputTunnel;

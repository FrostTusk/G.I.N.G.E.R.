const http = require('http');
const OutputTunnel = require('./OutputTunnel.js');

/**
 * Define who is logging: specific trick, perhaps some "tags"
 *
 */
module.exports = class LogOutputTunnel extends OutputTunnel {
  constructor(source) {
    super();
    this._source = source;
    this._tags = [];
  }

  addTags(tags) {
    for (tag in tags)
      this._tags.push(tags[tag]);
  }
};

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
    // Add option to only keep single copy of tags
    for (let tag in tags)
      this._tags.push(tags[tag]);
  }
};

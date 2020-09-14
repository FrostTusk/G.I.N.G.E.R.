//const nsfw = require('nsfw');
const nw = require('node-watch');
const fs = require('fs');
const moment = require('moment');

/*
Input: need a list of files and directories to track.

Output: triggers that are sent to home assistant -> HTTP output stream
Use the Home Assistant API

Use Cases: 1) Camera Upload
           2) ftp server in general
           3) Feeding into
              1) Log file changes -> send email eventually?
              2) Return appended line in general
*/
//module.exports = function(watch, outputTunnelList, trickMood, recursive, logTunnel) {
class FilewatchTrick {

  /**
   * Creates a new FilewatchTrick.
   * @constructor
   * @param {String} watch - A monitor for CEC networks, check package.json for more information.
   * @param {OutputTunnel[]} outputTunnelList - Input tunnels which trigger when an on request is received.
   * @param {FilewatchTrick~TrickMood} turnOffInputTunnels - Input tunnels which trigger when an on request is received.
   * @param {boolean} recursive - Input tunnels which trigger when a switch source request is received.
   * @param {LogOutputTunnel} logTunnel - Specifc output tunnel for logging information.
   */
  constructor(watch, outputTunnelList, trickMood, recursive, logTunnel) {
    if (logTunnel) logTunnel.addTags(['Filewatch'])

    let lastTime = moment();
    let settings = {};
    try {
      if (fs.lstatSync(watch).isDirectory() && recursive)
        settings.recursive = true;
    } catch (e) {
      if (logTunnel) logTunnel.emit('no such file or directory', ['tricks']);
      return; // ? What if it's a different error?
    }

    nw(watch, settings, function(evt, name) {
      if (lastTime.add(5, 'seconds').isAfter(moment()))
        return;

      lastTime = moment();
      if (!trickMood)
        trickMood = (evt, name) => {return {event: evt, name: name}};

      if (logTunnel) logTunnel.emit('event: ' + evt + ' name: ' + name, ['tricks']);

      for (let ot in outputTunnelList) {
        try {
            outputTunnelList[ot].emit(trickMood(evt, name));
        } catch (e) {
          if (e != 'skip')
            throw e;
        }
      }
    });

    if (logTunnel) logTunnel.emit('started listening for events on ' + watch, ['tricks']);
  }
}

module.exports = FilewatchTrick;

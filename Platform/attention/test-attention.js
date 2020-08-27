const Ginger = require('../core/ginger.js');
const ginger = new Ginger();

let prototype = require('../tricks/Filelookout.js');

let outputOptions = {
  hostname: '192.168.222.164',
  port: 8123,
  method: 'POST'
}
outputOptions.headers = require('./custom/tokens.js')();
let watch = '/home/canid/Git/G.I.N.G.E.R./Platform/tricks/dir1';


let outputTunnels = [ginger.createHTTPOutputTunnel(
  Object.assign({path: '/api/services/counter/increment'}, outputOptions),
  (data) => {
    return JSON.stringify({"entity_id": "counter.amnirana_motion_detector"});
})];

outputTunnels.push(ginger.createHTTPOutputTunnel(
  Object.assign({path: '/api/states/input_boolean.amnirana_motion_detector'}, outputOptions),
  (data) => {
    return JSON.stringify({state: 'on'});
}));

function trickMood(evt, name) {
  if (evt != 'update') //filter
    throw 'skip'
  return; //data doesn't matter
}

prototype(watch, outputTunnels, trickMood, true);


//ginger.createFileLookoutTrick

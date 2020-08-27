const Ginger = require('../core/ginger.js');
const ginger = new Ginger();

let prototype = require('../tricks/Filelookout.js');

let outputOptions = {
  hostname: '192.168.222.164',
  port: 8123,
  method: 'POST',
  headers: {
    "Authorization": "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiIyZDVkMDFlYmI0OWE0ODM2YjY1MmJiNTM1NDE2ZTZjYSIsImlhdCI6MTU5NzkzNzM5NywiZXhwIjoxOTEzMjk3Mzk3fQ.G9vlDfhFMcxzU0WRloi35TW9rYRIq2aXsfh12mMEBso",
    "content-type": "application/json"
  }
}

let watch = '/home/canid/Git/G.I.N.G.E.R./Platform/tricks/dir1';


let outputTunnels = [ginger.createHTTPOutputTunnel(
  Object.assign({path: '/api/services/counter/increment'}, outputOptions),
  (data) => {
    return JSON.stringify({"entity_id": "counter.amnirana_motion_detector"});
})];

outputTunnels.push(ginger.createHTTPOutputTunnel(
  Object.assign({path: '/api/states/amnirana_motion_detector'}, outputOptions),
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

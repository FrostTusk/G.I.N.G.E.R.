const Ginger = require('../core/ginger.js');
let ginger = new Ginger();
const tv_name = 'taricha';

let options = {
  hostname: 'localhost',
  port: 7896,
  method: 'POST',
  path: '/' + tv_name + '/on',
}
let onInputTunnel = ginger.createHTTPInputTunnel(options)

options.headers = {"content-type": "application/json"};
let outputTunnel = ginger.createHTTPOutputTunnel(options, (data) => {
   return JSON.stringify({source: data});
});

newoptions1 = {
  hostname: 'localhost',
  port: 7896,
  method: 'POST',
  path: '/' + tv_name + '/on',
}
newoptions1.path = '/' + tv_name + '/off';
let offInputTunnel = ginger.createHTTPInputTunnel(newoptions1)

newoptions2 = {
  hostname: 'localhost',
  port: 7896,
  method: 'POST',
  path: '/' + tv_name + '/on',
}
newoptions2.path = '/' + tv_name + '/source';
let sourceInputTunnel = ginger.createHTTPInputTunnel(newoptions2, (req, res) => {
  let source = req.body.source;
  console.log('in source');
  if (typeof(source) === 'number' && source >= 0 && source <= 9) {
    return source;
  }
   throw "THAT WAS A BAD NUMBER";
});


options = {
  hostname: '192.168.222.164',
  port: 8123,
  method: 'POST',
  path: '/api/states/input_boolean.' + tv_name,
  headers: {
    "Authorization": "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiIyZDVkMDFlYmI0OWE0ODM2YjY1MmJiNTM1NDE2ZTZjYSIsImlhdCI6MTU5NzkzNzM5NywiZXhwIjoxOTEzMjk3Mzk3fQ.G9vlDfhFMcxzU0WRloi35TW9rYRIq2aXsfh12mMEBso",
    "content-type": "application/json"
  }
}
let onOutputTunnel = ginger.createHTTPOutputTunnel(options, (data) => {
  return JSON.stringify({state: 'on'});
});

let offOutputTunnel = ginger.createHTTPOutputTunnel(options, (data) => {
  return JSON.stringify({state: 'off'});
});

options.path = '/api/states/input_select.' + tv_name
let sourceOutputTunnel = ginger.createHTTPOutputTunnel(options, (data) => {
  return JSON.stringify({state: data});
});


ginger.createHDMICECTVTrick(tv_name,
  [onInputTunnel], [offInputTunnel], [sourceInputTunnel],
  [onOutputTunnel], [offOutputTunnel], [sourceOutputTunnel])

//

setTimeout(function(){}, 2000);
outputTunnel.emit(1);
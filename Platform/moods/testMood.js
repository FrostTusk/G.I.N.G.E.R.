const Ginger = require('../core/ginger.js');
let ginger = new Ginger();
const tv_name = 'taricha';

let options = {
  hostname: '0.0.0.0',
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
  hostname: '0.0.0.0',
  port: 7896,
  method: 'POST',
  path: '/' + tv_name + '/on',
}
newoptions1.path = '/' + tv_name + '/off';
let offInputTunnel = ginger.createHTTPInputTunnel(newoptions1)

newoptions2 = {
  hostname: '0.0.0.0',
  port: 7896,
  method: 'POST',
  path: '/' + tv_name + '/on',
}
newoptions2.path = '/' + tv_name + '/source';
let sourceInputTunnel = ginger.createHTTPInputTunnel(newoptions2, (req, res) => {
  let source = req.body.new_source;
  console.log(source);
  if (typeof(source) === 'number' && source >= 0 && source <= 9) {
    return source;
  }
   throw "THAT WAS A BAD NUMBER";
});


let options3 = {
  hostname: '192.168.222.164',
  port: 8123,
  method: 'POST',
  path: '/api/states/input_boolean.' + tv_name,
  headers: {
    "Authorization": "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiIyZDVkMDFlYmI0OWE0ODM2YjY1MmJiNTM1NDE2ZTZjYSIsImlhdCI6MTU5NzkzNzM5NywiZXhwIjoxOTEzMjk3Mzk3fQ.G9vlDfhFMcxzU0WRloi35TW9rYRIq2aXsfh12mMEBso",
    "content-type": "application/json"
  }
}
let onOutputTunnel = ginger.createHTTPOutputTunnel(options3, (data) => {
  console.log("in on output tunnel");
  return JSON.stringify({state: 'on'});
});

let options4 = {
  hostname: '192.168.222.164',
  port: 8123,
  method: 'POST',
  path: '/api/states/input_boolean.' + tv_name,
  headers: {
    "Authorization": "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiIyZDVkMDFlYmI0OWE0ODM2YjY1MmJiNTM1NDE2ZTZjYSIsImlhdCI6MTU5NzkzNzM5NywiZXhwIjoxOTEzMjk3Mzk3fQ.G9vlDfhFMcxzU0WRloi35TW9rYRIq2aXsfh12mMEBso",
    "content-type": "application/json"
  }
}
let offOutputTunnel = ginger.createHTTPOutputTunnel(options4, (data) => {
  console.log("in off output tunnel");
  return JSON.stringify({state: 'off'});
});

let options5 = {
  hostname: '192.168.222.164',
  port: 8123,
  method: 'POST',
  path: '/api/states/input_select.' + tv_name,
  headers: {
    "Authorization": "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiIyZDVkMDFlYmI0OWE0ODM2YjY1MmJiNTM1NDE2ZTZjYSIsImlhdCI6MTU5NzkzNzM5NywiZXhwIjoxOTEzMjk3Mzk3fQ.G9vlDfhFMcxzU0WRloi35TW9rYRIq2aXsfh12mMEBso",
    "content-type": "application/json"
  }
}
let sourceOutputTunnel = ginger.createHTTPOutputTunnel(options5, (data) => {
  return JSON.stringify({state: data});
});


ginger.createHDMICECTVTrick(tv_name,
  [onInputTunnel], [offInputTunnel], [sourceInputTunnel],
  [onOutputTunnel], [offOutputTunnel], [sourceOutputTunnel])

//

//setTimeout(function(){}, 2000);
//outputTunnel.emit(1);

const Ginger = require('../core/ginger.js');
let ginger = new Ginger();
const tv_name = 'taricha';

let inputOptions = {
  hostname: '0.0.0.0',
  port: 7896,
  method: 'POST',
}

let onInputTunnel = ginger.createHTTPInputTunnel(
  Object.assign({path: '/' + tv_name + '/on'}, inputOptions)
);

let offInputTunnel = ginger.createHTTPInputTunnel(
  Object.assign({path: '/' + tv_name + '/off'}, inputOptions)
);

let sourceInputTunnel = ginger.createHTTPInputTunnel(
  Object.assign({path: '/' + tv_name + '/source'}, inputOptions),
  (req, res) => {
    if (typeof(source) === 'number' && source >= 0 && source <= 9)
      return source;
     throw "invalid source";
});


let outputOptions = {
  hostname: '192.168.222.164',
  port: 8123,
  method: 'POST',
  headers: {
    "Authorization": "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiIyZDVkMDFlYmI0OWE0ODM2YjY1MmJiNTM1NDE2ZTZjYSIsImlhdCI6MTU5NzkzNzM5NywiZXhwIjoxOTEzMjk3Mzk3fQ.G9vlDfhFMcxzU0WRloi35TW9rYRIq2aXsfh12mMEBso",
    "content-type": "application/json"
  }
}

let onOutputTunnel = ginger.createHTTPOutputTunnel(
  Object.assign({path: '/api/states/input_boolean.' + tv_name}, outputOptions),
  (data) => {
    return JSON.stringify({state: 'on'});
  });

let offOutputTunnel = ginger.createHTTPOutputTunnel(
  Object.assign({path: '/api/states/input_boolean.' + tv_name}, outputOptions),
  (data) => {
    return JSON.stringify({state: 'off'});
});

let sourceOutputTunnel = ginger.createHTTPOutputTunnel(
  Object.assign({path: '/api/states/input_select.' + tv_name}, outputOptions),
  (data) => {
    return JSON.stringify({state: data});
});


ginger.createHDMICECTVTrick(tv_name,
  [onInputTunnel], [offInputTunnel], [sourceInputTunnel],
  [onOutputTunnel], [offOutputTunnel], [sourceOutputTunnel])

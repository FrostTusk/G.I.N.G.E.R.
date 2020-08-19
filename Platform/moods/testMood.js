const Ginger = require('../core/ginger.js');
let ginger = new Ginger();

let options = {
  hostname: "localhost",
  port: 7896,
  method: "POST",
  path: "/echo",
}

inputTunnel = ginger.createHTTPInputTunnel(options, (req, res) => {
  return req.body;
});
// inputTunnel.on((data) => {
//   console.log(data);
// });

options.headers = {"content-type": "application/json"};
outputTunnel = ginger.createHTTPOutputTunnel(options, (data) => {
  return JSON.stringify({state: data});
});
outputTunnel.emit(1);

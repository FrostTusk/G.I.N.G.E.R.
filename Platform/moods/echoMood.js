const Ginger = require('../core/ginger.js');
let ginger = new Ginger();
const tv_name = 'taricha';

let options1 = {
  hostname: '0.0.0.0',
  port: 7896,
  method: 'POST',
  path: '/api/states/input_boolean.' + tv_name,
}
let onTunnel = ginger.createHTTPInputTunnel(options1)
onTunnel.on((data) => {
  console.log(data)
});

let options2 = {
  hostname: '0.0.0.0',
  port: 7896,
  method: 'POST',
  path: '/api/states/input_boolean.' + tv_name,
}
let offTunnel = ginger.createHTTPInputTunnel(options2);
offTunnel.on((data) => {
  console.log(data)
});

let options3 = {
  hostname: '0.0.0.0',
  port: 7896,
  method: 'POST',
  path: '/api/states/input_select.' + tv_name,
}
let sourceTunnel = ginger.createHTTPInputTunnel(options3);
sourceTunnel.on((data) => {
  console.log(data)
});



console.log(Object.assign(outputOptions, {test: "test"}));

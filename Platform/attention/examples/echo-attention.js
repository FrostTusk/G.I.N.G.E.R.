const Ginger = require('../core/ginger.js');
const ginger = new Ginger(true);

const options = {
  hostname: '0.0.0.0',
  port: 8124,
}

const tv_name = 'taricha'
const paths = [
  {method: 'POST', path: '/echo'},
  {method: 'GET', path: '/echo'}
]

let tunnel = ginger.createMyLogLogOutputTunnel('Tester');
for (i in paths) {
  let echoTunnel = ginger.createHTTPInputTunnel(Object.assign(paths[i], options), undefined, undefined, undefined, tunnel);
  echoTunnel.on((data) => {
    console.log(data);
  })
}

let outputOptions = {
  hostname: 'localhost',
  port: 8124,
  method: 'POST',
  headers: {
    "content-type": "application/json"
  }
}

tunnel = ginger.createMyLogLogOutputTunnel('outputtest');
let onOutputTunnel = ginger.createHTTPOutputTunnel(
  Object.assign({path: '/api/states/input_boolean.amnirana_motion_detector'}, outputOptions),
  (data) => {
    return JSON.stringify({state: 'on'});
  }, undefined, undefined, tunnel);
onOutputTunnel.emit();

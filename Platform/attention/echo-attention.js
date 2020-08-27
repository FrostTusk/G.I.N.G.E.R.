const Ginger = require('../core/ginger.js');
const ginger = new Ginger();

const options = {
  hostname: '0.0.0.0',
  port: 8124,
}

const tv_name = 'taricha'
const paths = [
  {method: 'POST', path: '/api/services/counter/increment'},
  {method: 'POST', path: '/api/states/input_boolean.amnirana_motion_detector'}
]

for (i in paths) {
  let echoTunnel = ginger.createHTTPInputTunnel(Object.assign(paths[i], options));
  echoTunnel.on((data) => {
    console.log(data);
  })
}

const ginger = require('../../core/ginger.js')(true);

const options = {
  hostname: '0.0.0.0',
  port: 8124,
}

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

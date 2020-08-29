const Ginger = require('../core/ginger.js');
const ginger = new Ginger();

let tunnel = ginger.createMyLogLogOutputTunnel('Tester');
tunnel.emit("test", ["test"]);
// let tunnel = ginger.createMyLogLogOutputTunnel('HTTP_INPUT_TUNNEl');
// tunnel.emit("test");
// let tunnel = ginger.createMyLogLogOutputTunnel('Tester');
// tunnel.emit("test");

const Ginger = require('../core/ginger.js');
let ginger = new Ginger();

let options = {
  hostname: "localhost",
  port: 7896,
  method: "POST",
  path: "/echo",
}

inputTunnel = ginger.createHTTPInputTunnel(options, (req, res) => {
  let source = req.body.source;
  if (typeof(source) === 'number' && source >= 0 && source <= 9) {
    return source;
  }
   throw "THAT WAS A BAD NUMBER";
});

testTrick("taricha", undefined, [], [], [inputTunnel], [], [], [])

options.headers = {"content-type": "application/json"};
outputTunnel = ginger.createHTTPOutputTunnel(options, (data) => {
  return JSON.stringify({source: data});
});
outputTunnel.emit(1);

options; //defined up front
function dataCB(data) {
  return JSON.stringify({state: data});
}

sourceOutput = new HTTPOutputTunnel(options, dataCB)

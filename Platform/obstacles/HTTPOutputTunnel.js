class HTTPOutputTunnel extends OutputTunnel {
  constructor(options, dataCB, authenticationHurdle) {
  }

  emit(extra) {
    new http.ClientRequest(this.options);
    request.end(this.dataCB(extra));
  }
};

const HOST = '0.0.0.0';
module.exports.HOST = HOST;

const PORT = 7896;
module.exports.PORT = PORT;

const http = require('http');
class CEC_LISTENER {
    constructor(hostname, port, headers, on_path, on_body, off_path, off_body, source_path, source_body) {
        this.options = {
	      hostname: hostname,
	      port: port,
	      method: "POST",
	      headers: headers
	    }        
        this.on_path = on_path;
        this.off_path = off_path;
        this.source_path = source_path;
        this.source_body = source_body;
    }

    sendOnUpdate() {
      this.options.path = this.on_path;
      let request = new http.ClientRequest(this.options);
      request.end(this.on_body);
    }

    sendOffUpdate() {
      this.options.path = this.off_path;
      let request = new http.ClientRequest(this.options);
      request.end(this.off_body);
    }
    
    sendSourceUpdate(source) {
      this.options.path = this.source_path;
      let request = new http.ClientRequest(this.options);
      request.end(this.source_body);
    }
};
module.exports.CEC_LISTENER = CEC_LISTENER;


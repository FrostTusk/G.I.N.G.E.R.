const { CEC, CECMonitor } = require("@senzil/cec-monitor");
const logging = require("../middleware/logging.js");
const http = require('http');

module.exports = function (app, constants) {
  class HA_CEC_LISTENER extends constants.CEC_LISTENER {
    sendSourceUpdate(source) {
      this.options.path = this.source_path;
      let request = new http.ClientRequest(this.options);
      return request.end(JSON.stringify({state: source}));
    }
  }

  let monitor = new CECMonitor("G.I.N.G.E.R.", {});
  logging.myLog({message: 'set up new CEC Monitor', source: 'ailurus mood'});

  require("../tricks/basic/echo.js")(app);
  require("../tricks/hdmi-cec-tv.js")(app, "taricha", monitor, [
    new HA_CEC_LISTENER('192.168.222.222', '8123', {
	    "Authorization": "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJjYmU5NzkxNTMxZGY0ZmMyYTVlZTBiMzNlMjEzMmNlZSIsImlhdCI6MTU5NzUzMTc2MywiZXhwIjoxOTEyODkxNzYzfQ.vT9VYaiw4J2UtuI6U5gYryq7QH_WHPnUfCwNNf_UQNQ",
	    "content-type": "application/json"
	  },
    '/api/states/input_boolean.taricha', JSON.stringify({state: 'on'}),
    '/api/states/input_boolean.taricha', JSON.stringify({state: 'off'}),
    '/api/states/input_select.taricha')]);
}


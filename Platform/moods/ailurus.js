const { CEC, CECMonitor } = require("@senzil/cec-monitor");
const logging = require("../middleware/logging.js");
const http = require('http');

module.exports = function (app, constants) {
  class HA_CEC_LISTENER extends constants.CEC_LISTENER {
    sendSourceUpdate(source) {
      return {state: source}
    }
  }

  let monitor = new CECMonitor("G.I.N.G.E.R.", {});
  logging.myLog({message: 'set up new CEC Monitor', source: 'ailurus mood'});

  require("../tricks/basic/echo.js")(app);
  require("../tricks/hdmi-cec-tv.js")(app, "taricha", monitor, [
    new HA_CEC_LISTENER('192.168.222.164', '8123', {
	          "Authorization": "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJkNDE5ZmFhODk3MzQ0NjViODMxZWRhMmRhYWEwYjc3NCIsImlhdCI6MTU5NzQxMTgzOSwiZXhwIjoxOTEyNzcxODM5fQ.r1LwULDi8gQ3b7jSNXITqrA7b1mJveOkJHPhFpzuQVU",
	          "content-type": "application/json"
	  },
    '/api/states/input_boolean.taricha', {state: 'on'},
    '/api/states/input_boolean.taricha', {state: 'off'},
    '/api/states/input_select.taricha')]);
}


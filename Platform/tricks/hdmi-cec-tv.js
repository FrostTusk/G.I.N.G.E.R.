const { CEC, CECMonitor } = require("@senzil/cec-monitor");
const logging = require('../middleware/logging.js');
const http = require('http');

function craftHTTPRequest(uriPath, body) {
      let request = new http.ClientRequest({
	      hostname: '192.168.222.164',
	      port: 8123,
	      path: uriPath,
	      method: "POST",
	      headers: {
	        "Authorization": "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJkNDE5ZmFhODk3MzQ0NjViODMxZWRhMmRhYWEwYjc3NCIsImlhdCI6MTU5NzQxMTgzOSwiZXhwIjoxOTEyNzcxODM5fQ.r1LwULDi8gQ3b7jSNXITqrA7b1mJveOkJHPhFpzuQVU",
	        "content-type": "application/json"
	      }
	  });
	  request.end(body);
}

module.exports = function (app, tv_name, monitor, listeners) {
    /// --- CEC-Monitor Listeners ---

    // --- TODO: Add debug toggle
    monitor.on(CECMonitor.EVENTS._OPCODE, function(packet) {
        //console.log(packet);
    });

    monitor.on(CECMonitor.EVENTS.IMAGE_VIEW_ON, function(packet) {
      logging.myLog({source: 'cec-client monitor', tags: ['hdmi-cec-tv', tv_name], 
        message: "IMAGE_VIEW_ON, TV IS ONLINE"});
      for (let i in listeners) {
        listeners[i].sendOnUpdate();
      };
    });

    monitor.on(CECMonitor.EVENTS.REPORT_POWER_STATUS, function(packet) {
      logging.myLog({source: 'cec-client monitor', tags: ['hdmi-cec-tv', tv_name], 
        message: "REPORT_POWER_STATUS, TV IS ONLINE"});
      for (let i in listeners) {
        listeners[i].sendOnUpdate();
      };
    });

    monitor.on(CECMonitor.EVENTS.STANDBY, function(packet) {
      logging.myLog({source: 'cec-client monitor', tags: ['hdmi-cec-tv', tv_name], 
        message: "STANDBY, TV IS OFFLINE"});
      for (let i in listeners) {
        listeners[i].sendOffUpdate();
      };
    });

    monitor.on(CECMonitor.EVENTS.ACTIVE_SOURCE, function(packet) {
      logging.myLog({source: 'cec-client monitor', tags: ['hdmi-cec-tv', tv_name], 
        message: "ACTIVE_SOURCE, TV IS ON SHOWING SOURCE" + packet.data.str[0]});
      for (let i in listeners) {
        listeners[i].sendSourceUpdate(packet.data.str[0]);
      };
    });

    monitor.on(CECMonitor.EVENTS.REPORT_PHYSICAL_ADDRESS, function(packet) {
      logging.myLog({source: 'cec-client monitor', tags: ['hdmi-cec-tv', tv_name], 
        message: "REPORT_PHYSICAL_ADDRESS, TV IS ON SHOWING SOURCE" + packet.data.str[0]});
      for (let i in listeners) {
        listeners[i].sendSourceUpdate(packet.data.str[0]);
      };
    });

    app.post('/' + tv_name + '/on', (req, res) => {
        logging.myLog({source: 'command', tags: ['hdmi-cec-tv', tv_name], 
            message: "turned on"});
        monitor.WriteRawMessage('tx 40:04');
        res.sendStatus(200);
        let body = JSON.stringify({state: "on"});
        craftHTTPRequest('/api/states/input_boolean.taricha', body);
    });

    app.post('/' + tv_name + '/off', (req, res) => {
        logging.myLog({source: 'command', tags: ['hdmi-cec-tv', tv_name], 
            message: "turned off"});
        monitor.WriteRawMessage('tx 40:36');
        res.sendStatus(200);
        let body = JSON.stringify({state: "off"});
        craftHTTPRequest('/api/states/input_boolean.taricha', body);
    });

    app.post('/' + tv_name + '/source', (req, res) => {
	    let new_source = req.body.new_source;
        console.log(req.body);
        if (typeof(new_source) === 'number' && new_source >= 0 && new_source <= 9) {
	        logging.myLog({source: 'command', tags: ['hdmi-cec-tv', tv_name], 
	            message: "changed source to " + req.body.new_source});
	        monitor.WriteRawMessage('tx 4F:82:' + new_source + '0:00');
            let body = JSON.stringify({state: new_source});
            craftHTTPRequest('/api/states/input_select.taricha', body);
	        res.sendStatus(200);
         } else {
            logging.myLog({source: 'command', tags: ['hdmi-cec-tv', tv_name],
            message: 'incorrect source'});
	        res.sendStatus(400);
        }
   });
}

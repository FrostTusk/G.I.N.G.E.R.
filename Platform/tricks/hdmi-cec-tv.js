const { CEC, CECMonitor } = require("@senzil/cec-monitor");
const logging = require('../middleware/logging.js');
module.exports = function (app, tv_name, monitor, listeners, debug) {
  /// --- CEC-Monitor Listeners ---
  if (debug) {
    monitor.on(CECMonitor.EVENTS._OPCODE, function(packet) {
    logging.myLog({source: 'cec-client monitor', tags: ['hdmi-cec-tv', tv_name], 
      message: "debug packet: " + JSON.stringify(packet)});
    });
  }

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
      message: "ACTIVE_SOURCE, TV IS SHOWING SOURCE " + packet.data.str[0]});
    for (let i in listeners) {
      listeners[i].sendSourceUpdate(packet.data.str[0]);
    };
  });

  monitor.on(CECMonitor.EVENTS.REPORT_PHYSICAL_ADDRESS, function(packet) {
    logging.myLog({source: 'cec-client monitor', tags: ['hdmi-cec-tv', tv_name], 
      message: "REPORT_PHYSICAL_ADDRESS, TV IS SHOWING SOURCE " + packet.data.str[0]});
    for (let i in listeners) {
      listeners[i].sendSourceUpdate(packet.data.str[0]);
    };
  });

  /// --- Command Endpoints ---

  app.post('/' + tv_name + '/on', (req, res) => {
    logging.myLog({source: 'command', tags: ['hdmi-cec-tv', tv_name], 
      message: "turned on"});
    monitor.WriteRawMessage('tx 40:04');
    res.sendStatus(200);
    for (let i in listeners) {
      listeners[i].sendOnUpdate();
    };
  });

  app.post('/' + tv_name + '/off', (req, res) => {
      logging.myLog({source: 'command', tags: ['hdmi-cec-tv', tv_name], 
          message: "turned off"});
      monitor.WriteRawMessage('tx 40:36');
      res.sendStatus(200);
      for (let i in listeners) {
        listeners[i].sendOffUpdate();
      };
  });

  app.post('/' + tv_name + '/source', (req, res) => {
    let new_source = req.body.new_source;
      if (typeof(new_source) === 'number' && new_source >= 0 && new_source <= 9) {
        logging.myLog({source: 'command', tags: ['hdmi-cec-tv', tv_name], 
          message: "changed source to " + req.body.new_source});
        monitor.WriteRawMessage('tx 4F:82:' + new_source + '0:00');
        res.sendStatus(200);
        for (let i in listeners) {
          listeners[i].sendSourceUpdate(new_source);
        };
       } else {
        logging.myLog({source: 'command', tags: ['hdmi-cec-tv', tv_name],
        message: 'incorrect source'});
        res.sendStatus(400);
      }
 });
}


//import {CEC, CECMonitor} from 'cec-monitor';
const { CEC, CECMonitor } = require("@senzil/cec-monitor");
const logging = require('../middleware/logging.js');

module.exports = function (app, tv_name='taricha') {
    //define listeners for cec on/off monitor.
    let monitor = new CECMonitor("G.I.N.G.E.R.", {});

    monitor.on(CECMonitor.EVENTS.REPORT_POWER_STATUS, function (packet) {
      console.log('packet', packet.data.str);
    });

    app.post('/' + tv_name + '/on', (req, res) => {
        logging.myLog({source: 'command', tags: ['hdmi-cec-tv', tv_name], 
            message: "turned on"});
        monitor.WriteRawMessage('tx 40:04');
        res.sendStatus(200);
    });

    app.post('/' + tv_name + '/off', (req, res) => {
        logging.myLog({source: 'command', tags: ['hdmi-cec-tv', tv_name], 
            message: "turned off"});
        monitor.WriteRawMessage('tx 40:36');
        res.sendStatus(200);
    });

    app.post('/' + tv_name + '/source', (req, res) => {
	    let new_source = req.body.new_source;
        console.log(new_source);
	    if (typeof(new_source) === 'number' && new_source >= 0 && new_source <= 9) {
		    logging.myLog({source: 'command', tags: ['hdmi-cec-tv', tv_name], 
		        message: "changed source to " + req.body.new_source});
		    monitor.WriteRawMessage('tx 4F:82:' + new_source + '0:00');
		    res.sendStatus(200);
	    } else {
            logging.myLog({source: 'command', tags: ['hdmi-cec-tv', tv_name],
                message: 'incorrect source'});
		    res.sendStatus(400);
	    }
    });
}

//import {CEC, CECMonitor} from 'cec-monitor';
const { CEC, CECMonitor } = require("@senzil/cec-monitor");
const logging = require('../../middleware/logging.js');

module.exports = function (app) {
    //define listener for cec on/off monitor.
    let monitor = new CECMonitor('custom-osdname', {
    });
    monitor.on(CECMonitor.EVENTS.REPORT_POWER_STATUS, function (packet) {
      console.log('packet',packet.data.str);

    });

    app.post('/taricha/on', (req, res) => {
        // 
        logging.myLog({tags: ['taricha'], message: JSON.stringify(req.body), source: 'command'});
        monitor.WriteRawMessage('tx 40:04');
        res.sendStatus(200);
    });

    app.post('/taricha/off', (req, res) => {
        logging.myLog({message: JSON.stringify(req.body), source: 'command'});
        monitor.WriteRawMessage('tx 40:36');
        res.sendStatus(200);
    });

}

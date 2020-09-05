const ginger = require('../../core/ginger.js')(true);

const tokens = require('./tokens.js');

const options = {
  host: "smtp.zoho.com'",
  port:  465,
  secure: true, // use SSL
  auth: tokens
}


let logTunnel = ginger.createMyLogLogOutputTunnel('Tester');

let MailTunnel = require('../../obstacles/tunnels/SMTPTunnel.js');
let mailTunnel = new MailTunnel(options, undefined, undefined, undefined, logTunnel);

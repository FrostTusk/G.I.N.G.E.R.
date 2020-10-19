const ginger = require('../../core/ginger.js')(true);

const tokens = require('../custom/tokens-smtp.js')();

const options = {
  host: "smtp.zoho.eu",
  port:  465,
  secure: true, // use SSL
  auth: tokens
}


let logTunnel = ginger.createMyLogLogOutputTunnel('Tester');

let MailTunnel = require('../../obstacles/tunnels/SMTPTunnel.js');
let mailTunnel = new MailTunnel(options, undefined, undefined, undefined, logTunnel,
  '"Fred Foo 👻" <admin@hub.industries>', 'frosttusk@gmail.com', "DUHDUHDUHDUH");
mailTunnel.emit("THIS ISAjkfdsajkfajkafb");

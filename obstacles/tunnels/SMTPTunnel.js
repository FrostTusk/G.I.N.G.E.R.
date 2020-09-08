const nodemailer = require('nodemailer');
const OutputTunnel = require('./OutputTunnel.js');

module.exports = class SMTPOutputTunnel extends OutputTunnel {
  constructor(options, outputMood, authenticationHurdle, authMood, logTunnel) {
    super(options, outputMood, authenticationHurdle);
    this._options = options;
    this._outputMood = (outputMood) ? outputMood: function(data) {return data};
    this._authenticationHurdle = authenticationHurdle;
    this._authMood = (authMood) ? authMood: function() {};
    this._logTunnel = logTunnel;
    if (logTunnel) logTunnel.addTags(['SMTPOutputTunnel']);
  }

  emit(data) {
    if (this._authenticationHurdle) {
      if (this._logTunnel) this._logTunnel.emit('received pre-authentication request', ['auth']);
      this._authenticationHurdle.guard(this._authMood(data));
    }

    let finalData = this._outputMood(data);
    //if (this._logTunnel) this._logTunnel.emit('path: ' + this._options.path + ' data: ' + JSON.stringify(finalData));

    // let request = new http.ClientRequest(this._options);
    // request.end(finalData);

    let transporter = nodemailer.createTransport(this._options);

    // send mail with defined transport object
    let info = transporter.sendMail({
      from: '"Fred Foo 👻" <admin@hub.industries>', // sender address
      to: "frosttusk@gmail.com", // list of receivers
      subject: "Hello ✔", // Subject line
      text: "Hello world?", // plain text body
    }).then(success => console.log('success: ', success))
      .catch(error => console.log('error: ', error));

    if (this._logTunnel) this._logTunnel.emit("Message sent: %s", info.messageId);
    // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
  }
};

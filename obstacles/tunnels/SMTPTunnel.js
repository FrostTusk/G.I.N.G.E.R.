const nodemailer = require('nodemailer');
const OutputTunnel = require('./OutputTunnel.js');

module.exports = class SMTPOutputTunnel extends OutputTunnel {
  constructor(options, outputMood, authenticationHurdle, authMood, logTunnel, from, to, subject) {
    super(options, outputMood, authenticationHurdle, from, to, subject);
    this._options = options;
    this._outputMood = (outputMood) ? outputMood: function(data) {return data};
    this._authenticationHurdle = authenticationHurdle;
    this._authMood = (authMood) ? authMood: function() {};
    this._logTunnel = logTunnel;
    this._from = from;
    this._to = to;
    this._subject = subject;
    if (logTunnel) logTunnel.addTags(['SMTPOutputTunnel']);
  }

  emit(data) {
    if (this._authenticationHurdle) {
      if (this._logTunnel) this._logTunnel.emit('received pre-authentication request', ['auth']);
      this._authenticationHurdle.guard(this._authMood(data));
    }

    let finalData = this._outputMood(data);
    let transporter = nodemailer.createTransport(this._options);

    // send mail with defined transport object
    let info = transporter.sendMail({
      from: this._from, // sender address
      to: this._to, // list of receivers
      subject: this._subject, // Subject line
      html: finalData, // html body
    }).then(success => this._logTunnel ? this._logTunnel.emit('Message success: ' + success.messageId):{})
      .catch(error => this._logTunnel ? this._logTunnel.emit('Message error: ' + error.messageId):{});

    if (this._logTunnel) this._logTunnel.emit("Message sent");
  }
};

const nodemailer = require('nodemailer');
const OutputTunnel = require('./OutputTunnel.js');

class SMTPOutputTunnel extends OutputTunnel {
  /**
   * Options as defined by nodemailer transport.
   * @typedef SMTPOutputTunnel~Options
   * @type {object}
   */

  /**
   * Mood that takes the original to be outputted data and transforms it into data for the actual output tunnel procedure.
   * @callback SMTPOutputTunnel~~OutputMood
   * @param {Object} data - original data.
   * @returns {Object} Data object to be used in the actual output tunnel.
   */

  /**
   * Mood that takes the original to be outputted data and transforms it into data for the authentication hurdle.
   * @callback SMTPOutputTunnel~~AuthMood
   * @param {Object} data - original data.
   * @returns {Object} Data object to be used by the authentication hurdle.
   */

  /**
   * Creates a new HTTPOutputTunnel.
   * @todo rename objects (logTunnel, authenticationHurdle)
   * @constructor
   * @param {SMTPOutputTunnel~Options} options - Configuration for the HTTP protocol.
   * @param {SMTPOutputTunnel~OutputMood} outputMood - OutputMood to be used by the tunnel.
   * @param {Object} authenticationHurdle - Obstacle that authenticates every outgoing request.
   * @param {SMTPOutputTunnel~AuthMood} AuthMood - to be used by the tunnel.
   * @param {Object} logTunnel - The logTunnel to be used.
   * @param {string} from - Email to be sent from, this should the same as the email address defined in options.
   */
  constructor(options, outputMood, authenticationHurdle, authMood, logTunnel, from) {
    super(options, outputMood, authenticationHurdle, from, to);
    this._options = options;
    this._outputMood = (outputMood) ? outputMood: function(data) {return data};
    this._authenticationHurdle = authenticationHurdle;
    this._authMood = (authMood) ? authMood: function() {};
    this._logTunnel = logTunnel;
    this._from = from;
    // this._to = to;
    if (logTunnel) logTunnel.addTags(['SMTPOutputTunnel']);
  }

  /**
   * Forward given data onto the smtp output channel.
   * @param {Object} data.data - The actual data to be sent onto the channel.
   * @param {Object} data.subject - String to be used as subject.
   * @param {Object} data.from - Name of person who sent the email.
   * @param {Object} data.to - Email to be sent to.
   */
  emit(data) {
    if (this._authenticationHurdle) {
      if (this._logTunnel) this._logTunnel.emit('received pre-authentication request', ['auth']);
      this._authenticationHurdle.guard(this._authMood(data));
    }

    let finalData = this._outputMood(data.data);
    let transporter = nodemailer.createTransport(this._options);

    // send mail with defined transport object
    let info = transporter.sendMail({
      from: data.from + " <" + this._from + ">", // sender address
      to: data.to, // list of receivers
      subject: data.subject, // Subject line
      html: finalData, // html body
    }).then(success => this._logTunnel ? this._logTunnel.emit('Message success: ' + success.messageId):{})
      .catch(error => this._logTunnel ? this._logTunnel.emit('Message error: ' + error.messageId):{});

    if (this._logTunnel) this._logTunnel.emit("Message sent");
  }
};

module.exports = SMTPOutputTunnel;

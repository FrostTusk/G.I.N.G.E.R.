const { CECMonitor } = require('@senzil/cec-monitor');

/**
 * An trick that allows for controlling an HDMI-CEC enabled TV.
 *
 * @see module:obstacles/tunnels/InputTunnel
 *
 * @property {object} _monitor A monitor for CEC networks, check package.json for more information.
 * @property {InputTunnel[]} _turnOnInputTunnels
 *    Input tunnels which trigger when an on request is received.
 * @property {InputTunnel[]} _turnOffInputTunnels
 *    Input tunnels which trigger when an on request is received.
 * @property {InputTunnel[]} _switchSourceInputTunnels
 *    Input tunnels which trigger when a switch source request is received.
 * @property {OutputTunnel[]} _onListenerTunnels
 *    Output tunnels which trigger when an on state change is detected.
 * @property {OutputTunnel[]} _offListenerTunnels
 *    Output tunnels which trigger when an off state change is detected.
 * @property {OutputTunnel[]} _sourceListenerTunnel
 *    Output tunnels which trigger when a change source state change is detected.
 * @property {LogOutputTunnel} _logTunnel
 *    Specific output tunnel for logging information.
 */
class HDMICECTrick {
  /**
   * Creates a new HDMICECTrick.
   *
   * @class
   *
   * @todo This needs to be moved to a parameter object.
   * @param {object} monitor - A monitor for CEC networks, check package.json for more information.
   * @param {InputTunnel[]} turnOnInputTunnels - Input tunnels which trigger when an on request is received.
   * @param {InputTunnel[]} turnOffInputTunnels - Input tunnels which trigger when an on request is received.
   * @param {InputTunnel[]} switchSourceInputTunnels - Input tunnels which trigger when a switch source request is received.
   * @param {OutputTunnel[]} onListenerTunnels - Output tunnels which trigger when an on state change is detected.
   * @param {OutputTunnel[]} offListenerTunnels - Output tunnels which trigger when an off state change is detected.
   * @param {OutputTunnel[]} sourceListenerTunnels - Output tunnels which trigger when a change source state change is detected.
   * @param {LogOutputTunnel} logTunnel - Specific output tunnel for logging information.
   */
  constructor (monitor,
    turnOnInputTunnels, turnOffInputTunnels, switchSourceInputTunnels,
    onListenerTunnels, offListenerTunnels, sourceListenerTunnels, logTunnel) {
    this._monitor = monitor;
    this._turnOnInputTunnels = turnOnInputTunnels;
    this._turnOffInputTunnels = turnOffInputTunnels;
    this._switchSourceInputTunnels = switchSourceInputTunnels;
    this._onListenerTunnels = onListenerTunnels;
    this._offListenerTunnels = offListenerTunnels;
    this._sourceListenerTunnels = sourceListenerTunnels;
    this._logTunnel = logTunnel;

    this.setUpLogging();
    this._setUpListeners();
    this._setUpInput();
  }

  setUpLogging () {
    if (!this._logTunnel) return;

    this._logTunnel.addTags(['HDMI-CEC-TV']);

    // if (false) {
    //   this._monitor.on(CECMonitor.EVENTS._OPCODE, function(packet) {
    //     console.log(JSON.stringify(packet));
    //   });
    // }
  }

  _setUpListeners () {
    this._monitor.on(CECMonitor.EVENTS.REPORT_POWER_STATUS, (packet) => {
      if (this._logTunnel) this._logTunnel.emit('REPORT_POWER_STATUS: ' + packet.data.str, ['tricks']);

      if (packet.data.str === 'ON') {
        this._onListenerTunnels.forEach(tunnel => tunnel.emit());
      } else {
        this._offListenerTunnels.forEach(tunnel => tunnel.emit());
        this._sourceListenerTunnels.forEach(tunnel => tunnel.emit(0));
      }
    });

    this._monitor.on(CECMonitor.EVENTS.IMAGE_VIEW_ON, (packet) => {
      if (this._logTunnel) this._logTunnel.emit('IMAGE_VIEW_ON: (TV is ON)', ['tricks']);

      this._onListenerTunnels.forEach(tunnel => tunnel.emit());
    });

    this._monitor.on(CECMonitor.EVENTS.STANDBY, (packet) => {
      if (this._logTunnel) this._logTunnel.emit('STANDBY: (TV is OFF)', ['tricks']);

      this._offListenerTunnels.forEach(element => element.emit());
      this._sourceListenerTunnels.forEach(tunnel => tunnel.emit(0));
    });

    this._monitor.on(CECMonitor.EVENTS.ACTIVE_SOURCE, (packet) => {
      if (this._logTunnel) this._logTunnel.emit('ACTIVE_SOURCE: (TV is ON)', ['tricks']);

      this._onListenerTunnels.forEach(tunnel => tunnel.emit());
    });

    this._monitor.on(CECMonitor.EVENTS.REPORT_PHYSICAL_ADDRESS, (packet) => {
      if (this._logTunnel) this._logTunnel.emit('REPORT_PHYSICAL_ADDRESS: source ' + packet.data.str[0], ['tricks']);

      this._sourceListenerTunnels.forEach(tunnel => tunnel.emit(packet.data.str[0]));
    });
  }

  _setUpInput () {
    this._turnOnInputTunnels.forEach(inputTunnel => {
      inputTunnel.on(() => {
        if (this._logTunnel) this._logTunnel.emit('Turning TV on', ['tricks']);
        this._monitor.WaitForReady().then(() => this._monitor.WriteRawMessage('tx 40:04'));

        this._onListenerTunnels.forEach(outputTunnel => outputTunnel.emit());
      });
    });

    this._turnOffInputTunnels.forEach(inputTunnel => {
      inputTunnel.on(() => {
        if (this._logTunnel) this._logTunnel.emit('Turning TV off', ['tricks']);
        this._monitor.WaitForReady().then(() => this._monitor.WriteRawMessage('tx 40:36'));

        this._offListenerTunnels.forEach(outputTunnel => outputTunnel.emit());
      });
    });

    this._switchSourceInputTunnels.forEach(inputTunnel => {
      inputTunnel.on((source) => {
        if (this._logTunnel) this._logTunnel.emit('Switch TV source to ' + source, ['tricks']);
        this._monitor.WaitForReady().then(() => this._monitor.WriteRawMessage('tx 4F:82:' + source + '0:00'));

        this._sourceListenerTunnels.forEach(outputTunnel => outputTunnel.emit(source));
      });
    });
  }
}

module.exports = HDMICECTrick;

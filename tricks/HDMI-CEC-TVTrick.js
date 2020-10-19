const { CECMonitor } = require('@senzil/cec-monitor');

/**
 * An trick that allows for controlling an HDMI-CEC enabled TV.
 *
 * @module tricks/
 *
 * @property {object} _monitor A monitor for CEC networks, check package.json for more information.
 * @property {module:obstacles/tunnels~InputTunnel[]} _turnOffInputTunnels
 *    Input tunnels which trigger when an on request is received.
 * @property {module:obstacles/tunnels~InputTunnel[]} _switchSourceInputTunnels
 *    Input tunnels which trigger when a switch source request is received.
 * @property {module:obstacles/tunnels~OutputTunnel[]} _onListenerTunnels
 *    Output tunnels which trigger when an on state change is detected.
 * @property {module:obstacles/tunnels~OutputTunnel[]} _offListenerTunnels
 *    Output tunnels which trigger when an off state change is detected.
 * @property {module:obstacles/tunnels~OutputTunnel[]} _sourceListenerTunnels
 *    Output tunnels which trigger when a change source state change is detected.
 * @property {module:obstacles/tunnels~LogOutputTunnel} _logTunnel
 *    Specific output tunnel for logging information.
 */
class HDMICECTrick {
  /**
   * Creates a new HDMICECTrick.
   *
   * @todo This needs to be moved to a parameter object.
   *
   * @class
   *
   * @param {object} monitor A monitor for CEC networks, check package.json for more information.
   * @param {module:obstacles/tunnels~InputTunnel[]} turnOnInputTunnels
   *    Input tunnels which trigger when an on request is received.
   * @param {module:obstacles/tunnels~InputTunnel[]} turnOffInputTunnels
   *    Input tunnels which trigger when an on request is received.
   * @param {module:obstacles/tunnels~InputTunnel[]} switchSourceInputTunnels
   *    Input tunnels which trigger when a switch source request is received.
   * @param {module:obstacles/tunnels~OutputTunnel[]} onListenerTunnels
   *    Output tunnels which trigger when an on state change is detected.
   * @param {module:obstacles/tunnels~OutputTunnel[]} offListenerTunnels
   *    Output tunnels which trigger when an off state change is detected.
   * @param {module:obstacles/tunnels~OutputTunnel[]} sourceListenerTunnels
   *    Output tunnels which trigger when a change source state change is detected.
   * @param {module:obstacles/tunnels~LogOutputTunnel} logTunnel
   *    Specific output tunnel for logging information.
   */
  constructor (monitor,
    turnOnInputTunnels, turnOffInputTunnels, switchSourceInputTunnels,
    onListenerTunnels, offListenerTunnels, sourceListenerTunnels, logTunnel) {
    this._monitor = monitor;

    /**
     * @property {module:obstacles/tunnels~InputTunnel[]} _turnOnInputTunnels
     *    Input tunnels which trigger when an on request is received.
     */
    this._onListenerTunnels = onListenerTunnels;
    this._offListenerTunnels = offListenerTunnels;
    this._sourceListenerTunnels = sourceListenerTunnels;

    this.setUpLogging(logTunnel);
    this._setUpListeners(logTunnel);
    this._setUpInput(turnOnInputTunnels, turnOffInputTunnels, switchSourceInputTunnels, logTunnel);
  }

  setUpLogging (logTunnel) {
    if (!logTunnel) return;

    logTunnel.addTags(['HDMI-CEC-TV']);

    // if (false) {
    //   this._monitor.on(CECMonitor.EVENTS._OPCODE, function(packet) {
    //     console.log(JSON.stringify(packet));
    //   });
    // }
  }

  _setUpListeners (logTunnel) {
    this._monitor.on(CECMonitor.EVENTS.REPORT_POWER_STATUS, (packet) => {
      if (logTunnel) logTunnel.emit('REPORT_POWER_STATUS: ' + packet.data.str, ['tricks']);

      if (packet.data.str === 'ON') {
        this._onListenerTunnels.forEach(tunnel => tunnel.emit());
      } else {
        this._offListenerTunnels.forEach(tunnel => tunnel.emit());
        this._sourceListenerTunnels.forEach(tunnel => tunnel.emit(0));
      }
    });

    this._monitor.on(CECMonitor.EVENTS.IMAGE_VIEW_ON, (packet) => {
      if (logTunnel) logTunnel.emit('IMAGE_VIEW_ON: (TV is ON)', ['tricks']);

      this._onListenerTunnels.forEach(tunnel => tunnel.emit());
    });

    this._monitor.on(CECMonitor.EVENTS.STANDBY, (packet) => {
      if (logTunnel) logTunnel.emit('STANDBY: (TV is OFF)', ['tricks']);

      this._offListenerTunnels.forEach(element => element.emit());
      this._sourceListenerTunnels.forEach(tunnel => tunnel.emit(0));
    });

    this._monitor.on(CECMonitor.EVENTS.ACTIVE_SOURCE, (packet) => {
      if (logTunnel) logTunnel.emit('ACTIVE_SOURCE: (TV is ON)', ['tricks']);

      this._onListenerTunnels.forEach(tunnel => tunnel.emit());
    });

    this._monitor.on(CECMonitor.EVENTS.REPORT_PHYSICAL_ADDRESS, (packet) => {
      if (logTunnel) logTunnel.emit('REPORT_PHYSICAL_ADDRESS: source ' + packet.data.str[0], ['tricks']);

      this._sourceListenerTunnels.forEach(tunnel => tunnel.emit(packet.data.str[0]));
    });
  }

  _setUpInput (turnOnInputTunnels, turnOffInputTunnels, switchSourceInputTunnels, logTunnel) {
    turnOnInputTunnels.forEach(inputTunnel => {
      inputTunnel.on(() => {
        if (logTunnel) logTunnel.emit('Turning TV on', ['tricks']);
        this._monitor.WaitForReady().then(() => this._monitor.WriteRawMessage('tx 40:04'));

        this._onListenerTunnels.forEach(outputTunnel => outputTunnel.emit());
      });
    });

    turnOffInputTunnels.forEach(inputTunnel => {
      inputTunnel.on(() => {
        if (logTunnel) logTunnel.emit('Turning TV off', ['tricks']);
        this._monitor.WaitForReady().then(() => this._monitor.WriteRawMessage('tx 40:36'));

        this._offListenerTunnels.forEach(outputTunnel => outputTunnel.emit());
      });
    });

    switchSourceInputTunnels.forEach(inputTunnel => {
      inputTunnel.on((source) => {
        if (logTunnel) logTunnel.emit('Switch TV source to ' + source, ['tricks']);
        this._monitor.WaitForReady().then(() => this._monitor.WriteRawMessage('tx 4F:82:' + source + '0:00'));

        this._sourceListenerTunnels.forEach(outputTunnel => outputTunnel.emit(source));
      });
    });
  }
}

module.exports = HDMICECTrick;

const { CEC, CECMonitor } = require("@senzil/cec-monitor");
/*
 * Tunnels
 * outputTunnelOn : emit will be called without data
 * outputTunnelSource : emit will be called with data=new_source
 */

class HDMICECTrick {
  constructor(monitor,
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

      this._setUpLogging();
      this._setUpListeners();
      this._setUpInput();
  }


  function _setUpLogging() {
    if (!this._logTunnel) return;

    this._logTunnel.addTags(['HDMI-CEC-TV']);

    if (false) {
        this._monitor.on(CECthis._monitor.EVENTS._OPCODE, function(packet) {
        console.log(JSON.stringify(packet));
      });
    }
  }


  function _setUpListeners() {
    this._monitor.on(CECthis._monitor.EVENTS.REPORT_POWER_STATUS, function(packet) {
      if (this._logTunnel) this._logTunnel.emit('REPORT_POWER_STATUS: ' + packet.data.str, ['tricks']);

      if (packet.data.str === "ON") {
        for (let i in onListenerTunnels)
          onListenerTunnels[i].emit();
      } else {
        for (let i in this._offListenerTunnels)
          this._offListenerTunnels[i].emit();
        for (let i in this._sourceListenerTunnels)
          this._sourceListenerTunnels[i].emit(0);
      }
    });

    this._monitor.on(CECthis._monitor.EVENTS.IMAGE_VIEW_ON, function(packet) {
      if (this._logTunnel) this._logTunnel.emit('IMAGE_VIEW_ON: (TV is ON)', ['tricks']);

      for (let i in onListenerTunnels)
        onListenerTunnels[i].emit();
    });

    this._monitor.on(CECthis._monitor.EVENTS.STANDBY, function(packet) {
      if (this._logTunnel) this._logTunnel.emit('STANDBY: (TV is OFF)', ['tricks']);

      for (let i in this._offListenerTunnels)
        this._offListenerTunnels[i].emit();
      for (let i in this._sourceListenerTunnels)
        this._sourceListenerTunnels[i].emit(0);
    });

    this._monitor.on(CECthis._monitor.EVENTS.ACTIVE_SOURCE, function(packet) {
      if (this._logTunnel) this._logTunnel.emit('ACTIVE_SOURCE: (TV is ON)', ['tricks']);

      for (let i in onListenerTunnels)
        onListenerTunnels[i].emit();
    });

    this._monitor.on(CECthis._monitor.EVENTS.REPORT_PHYSICAL_ADDRESS, function(packet) {
      if (this._logTunnel) this._logTunnel.emit('REPORT_PHYSICAL_ADDRESS: source ' + packet.data.str[0], ['tricks']);

      for (let i in this._sourceListenerTunnels)
        this._sourceListenerTunnels[i].emit(packet.data.str[0]);
    });
  }


  function _setUpInput() {
    for (t in this._turnOnInputTunnels) {
      this._turnOnInputTunnels[t].on(() => {
        if (this._logTunnel) this._logTunnel.emit('Turning TV on', ['tricks']);
        this._monitor.WaitForReady().then(() => this._monitor.WriteRawMessage('tx 40:04'));
        for (tunnel in onListenerTunnels)
          onListenerTunnels[tunnel].emit()
      });
    }

    for (t in this._turnOffInputTunnels) {
      this._turnOffInputTunnels[t].on(() => {
        if (this._logTunnel) this._logTunnel.emit('Turning TV off', ['tricks']);
        this._monitor.WaitForReady().then(() => this._monitor.WriteRawMessage('tx 40:36'));
        for (tunnel in this._offListenerTunnels)
          this._offListenerTunnels[tunnel].emit()
      });
    }

    for (t in this._switchSourceInputTunnels) {
      this._switchSourceInputTunnels[t].on((source) => {
        if (this._logTunnel) this._logTunnel.emit('Switch TV source to ' + source, ['tricks']);
        this._monitor.WaitForReady().then(() => this._monitor.WriteRawMessage('tx 4F:82:' + source + '0:00'));
        for (tunnel in onListenerTunnels)
          this._sourceListenerTunnels[tunnel].emit(source)
      });
    }
  }
}

module.exports = HDMICECTrick;

const { CEC, CECMonitor } = require("@senzil/cec-monitor");
/*
 * Tunnels
 * outputTunnelOn : emit will be called without data
 * outputTunnelSource : emit will be called with data=new_source
 */
module.exports = function (tv_name, monitor,
  turnOnInputTunnels, turnOffInputTunnels, switchSourceInputTunnels,
  onListenerTunnels, offListenerTunnels, sourceListenerTunnels) {

  if (false) {
    monitor.on(CECMonitor.EVENTS._OPCODE, function(packet) {
      console.log(JSON.stringify(packet));
    });
  }

  monitor.on(CECMonitor.EVENTS.REPORT_POWER_STATUS, function(packet) {
    if (packet.data.str === "ON") {
      for (let i in onListenerTunnels)
        onListenerTunnels[i].emit();
    } else {
      for (let i in offListenerTunnels)
        offListenerTunnels[i].emit();
      for (let i in sourceListenerTunnels)
        sourceListenerTunnels[i].emit(0);
    }
  });

  monitor.on(CECMonitor.EVENTS.IMAGE_VIEW_ON, function(packet) {
    for (let i in onListenerTunnels)
      onListenerTunnels[i].emit();
  });

  monitor.on(CECMonitor.EVENTS.STANDBY, function(packet) {
    for (let i in onListenerTunnels)
      onListenerTunnels[i].emit();
    for (let i in sourceListenerTunnels)
      sourceListenerTunnels[i].emit(0);
  });

  monitor.on(CECMonitor.EVENTS.ACTIVE_SOURCE, function(packet) {
    for (let i in onListenerTunnels)
      onListenerTunnels[i].emit();
  });

  monitor.on(CECMonitor.EVENTS.REPORT_PHYSICAL_ADDRESS, function(packet) {
    for (let i in sourceListenerTunnels)
      sourceListenerTunnels[i].emit(packet.data.str[0]);
  });

  for (t in turnOnInputTunnels) {
    turnOnInputTunnels[t].on(() => {
      console.log("entered turn on input tunnel");
      monitor.WriteRawMessage('tx 40:04');
      for (tunnel in onListenerTunnels)
        onListenerTunnels[tunnel].emit()
    });
  }

  for (t in turnOffInputTunnels) {
    turnOffInputTunnels[t].on(() => {
      console.log("entered turn off input tunnel");
      monitor.WriteRawMessage('tx 40:36');
      for (tunnel in offListenerTunnels)
        offListenerTunnels[tunnel].emit()
    });
  }

  for (t in switchSourceInputTunnels) {
    switchSourceInputTunnels[t].on((source) => {
      console.log("entered source input tunnel");
      monitor.WriteRawMessage('tx 4F:82:' + source + '0:00');
      for (tunnel in onListenerTunnels)
        sourceListenerTunnels[tunnel].emit(source)
    });
  }
}

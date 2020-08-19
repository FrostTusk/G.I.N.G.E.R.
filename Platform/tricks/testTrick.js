/*
 * Tunnels
 * outputTunnelOn : emit will be called without data
 * outputTunnelSource : emit will be called with data=new_source
 */
module.exports = function (tv_name, monitor, onInputChannel, onListenerTunnels, outputChannel) {
  onInputChannel.on((data) => {
    monitor.WriteRawMessage('tx 40:04');
    for (tunnel in onListenerTunnels)
      onListenerTunnels(tunnel).emit()
  })

  monitor.on(CECMonitor.EVENTS.REPORT_POWER_STATUS, function(packet) {
    if (packet.data.str === "ON") {
      // Logging obstacle
      // logging.myLog({source: 'cec-client monitor', tags: ['hdmi-cec-tv', tv_name],
      //   message: "REPORT_POWER_STATUS, TV IS ONLINE"});
      // All outputchannels
      for (let i in onListenerTunnels) {
        onListenerTunnels[i].emit();
      };
    } else {
      // Logging
      // logging.myLog({source: 'cec-client monitor', tags: ['hdmi-cec-tv', tv_name],
      //   message: "REPORT_POWER_STATUS, TV IS OFFLINE"});
      for (let i in listeners) {
        offListenerTunnels[i].emit();
        sourceListenerTunnels[i].emit(0);
      };
    }
  });
}

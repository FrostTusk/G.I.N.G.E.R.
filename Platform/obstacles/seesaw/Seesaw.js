module.exports =  class Seesaw {
    constructor() {
    }

    on(time, procedure) {
      let heartbeat = () => {
        this.procedure()
        setTimeout(heartbeat, time)
      }
      setTimeout(heartbeat, time)
    }
};

class HTTPInputTunnel extends InputTunnel {
    constructor(app, endpoint, authenticationHurdle, logging) {
      app.on(endpoint, function(req, res) => {
        authenticationHurdle.guard(req.data);
        this.cb(req.data); //Doesn't fully make sense
        res.sendStatus(200);
      });
    }
};

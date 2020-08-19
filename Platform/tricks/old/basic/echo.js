const logging = require('../../middleware/logging.js');

function echo(req, res) {
    let requestJSON;
    try {
        requestJSON = JSON.stringify(req.body)
    } catch (e) {
        logging.myLog({source: 'command', tags: ['basic', 'echo'],
            message: "received invalid json"})
        res.sendStatus(400);
        return;
    }
    logging.myLog({source: 'command', tags: ['basic', 'echo'],
        message: requestJSON});
    res.json(req.body);
}

module.exports = function (app) {
    app.get('/echo', (req, res) => {
        echo(req, res);
    });  

    app.post('/echo', (req, res) => {
        echo(req, res);
    });

    app.put('/echo', (req, res) => {
        echo(req, res);
    });

    app.delete('/echo', (req, res) => {
        echo(req, res);
    });
}

const logging = require('./middleware/logging.js');
const constants = require('./constants.js')

// Set up express server
const express = require('express');
const app = express();
app.use(express.json());

// Load in moods
const args = process.argv.slice(2);
for (i in args) {
  logging.myLog({message: "G.I.N.G.E.R. is in " + args[i] + " mood", source: "ginger"});
  require('./moods/' + args[i] + '.js')(app);
}

// Start paying attention
logging.myLog({message: 'G.I.N.G.E.R. is paying attention on ' + constants.HOST +
                        ' and port ' + constants.PORT,
               source: 'ginger'})
app.listen(constants.PORT, constants.HOST);

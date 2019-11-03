const logging = require('./middleware/logging.js');
const constants = require('./constants.js')

// Set up express server
const express = require('express');
const app = express();
app.use(express.json());

// Load in configurations
const args = process.argv.slice(2);
for (i in args)
  require('./configs/' + args[i] + '.js')(app);

// Start the Hook Server
logging.myLog({message: 'starting hook server on host ' + constants.HOST +
                        ' and port ' + constants.PORT,
               source: 'hook'})
app.listen(constants.PORT, constants.HOST);

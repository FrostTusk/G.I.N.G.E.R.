const express = require('express');


var args = process.argv.slice(2);


// App
const app = express();
app.use(express.json());

console.log("loading config of: " + args[0]);
require("./configs/" + args[0] + ".js")(app);

console.log("starting server");
app.listen(7896, '0.0.0.0');

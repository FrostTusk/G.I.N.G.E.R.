const logging = require("../middleware/logging.js");

module.exports = function (app) {
  logging.myLog({message: "loading ailurus module", source: "hook"});
  require("../modules/axolotl/endpoint.js")(app);
}

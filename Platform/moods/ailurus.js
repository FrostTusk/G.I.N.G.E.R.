const logging = require("../middleware/logging.js");

module.exports = function (app) {
  require("../tricks/staurois/arm-disarm.js")(app);
  require("../tricks/basic/echo.js")(app);
}

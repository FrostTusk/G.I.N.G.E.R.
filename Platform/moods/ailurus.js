const logging = require("../middleware/logging.js");

module.exports = function (app) {
  require("../tricks/basic/echo.js")(app);
  require("../tricks/hdmi-cec-tv.js")(app, "taricha");
}

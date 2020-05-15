const logging = require("../middleware/logging.js");

module.exports = function (app) {
  require("../tricks/axolotl/camera-arming.js")(app);
  require("../tricks/basic/echo.js")(app);
}

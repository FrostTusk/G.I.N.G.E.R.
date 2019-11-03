module.exports = function (app) {
  console.log("pinging");
  require("../modules/axolotl/endpoint.js")(app);
}

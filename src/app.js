const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const logger = require("./logger/logger");
const apiRoute = require("./routes/");
const path = require("path");
const cors = require("cors");
var allowedOrigins = ["http://yourapp.com"];
var getClientIp = function (req) {
  var ipAddress = req.connection.remoteAddress;
  if (!ipAddress) {
    return "";
  }
  // convert from "::ffff:192.0.0.1"  to "192.0.0.1"
  if (ipAddress.substr(0, 7) == "::ffff:") {
    ipAddress = ipAddress.substr(7);
  }
  return ipAddress;
};
const whiteList = [""];
app.use((req, res, next) => {
  var ipAddress = getClientIp(req);
  console.log(ipAddress);
  if (whiteList.includes(ipAddress)) {
    next();
  } else {
    res.send(ipAddress + " IP is not in whiteList");
  }
});

app.use(logger());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/", express.static(path.join(__dirname, "/public")));
app.use("/api", apiRoute);

module.exports = app;

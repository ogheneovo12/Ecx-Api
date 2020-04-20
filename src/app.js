const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const logger = require("./logger/logger");
const apiRoute = require("./routes/");
const path = require("path");
const cors = require("cors");
("use strict");

var os = require("os");
var ifaces = os.networkInterfaces();
function getIp() {
  Object.keys(ifaces).forEach(function (ifname) {
    var alias = 0;

    ifaces[ifname].forEach(function (iface) {
      if ("IPv4" !== iface.family || iface.internal !== false) {
        // skip over internal (i.e. 127.0.0.1) and non-ipv4 addresses
        return;
      }

      if (alias >= 1) {
        // this single interface has multiple ipv4 addresses
        console.log(ifname + ":" + alias, iface.address);
      } else {
        // this interface has only one ipv4 adress
        console.log(ifname, iface.address);
      }
      ++alias;
    });
  });
}

var allowedOrigins = ["http://yourapp.com"];
var getClientIp = function (req) {
  getIp();
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
const whiteList = ["10.45.182.145", "10.35.189.198", "102.89.0.16"];
app.use((req, res, next) => {
  var ipAddress = getClientIp(req);
  if (whiteList.includes(ipAddress)) {
    next();
  } else {
    res
      .status(403)
      .json({ error: ipAddress + " IP is not allowed to visit this site" });
  }
});
app.use(cors());
app.use(logger());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/", express.static(path.join(__dirname, "/public")));
app.use("/api", apiRoute);

module.exports = app;

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
//cors was not working ooooo
// app.use(
//   cors({
//     origin: function (origin, callback) {
//       // allow requests with no origin
//       // (like mobile apps or curl requests)
//       // if (!origin) return callback(null, true);
//       console.log(origin);
//       if (!whiteList.includes(origin)) {
//         var msg =
//           "The CORS policy for this site does not " +
//           "allow access from the specified Origin.";
//         return callback("not allowed", false);
//       }
//       return callback(null, true);
//     },
//   })
// );

app.use(logger());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/", express.static(path.join(__dirname, "/public")));
app.use("/api", apiRoute);

module.exports = app;

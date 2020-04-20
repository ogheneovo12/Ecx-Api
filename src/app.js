const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const logger = require("./logger/logger");
const apiRoute = require("./routes/");
const path = require("path");
const cors = require("cors");

const whitelist = ["34.236.76.223"];
var checkForvalidIp = function (req, callback) {
  const options = {
    methods: ["GET", "PUT", "POST", "DELETE", "HEAD", "PATCH"],
  };

  const currentIpAddress = req.connection.remoteAddress;
  var ip =
    (req.headers["x-forwarded-for"] || "").split(",").pop() ||
    req.connection.remoteAddress ||
    req.socket.remoteAddress ||
    req.connection.socket.remoteAddress;
  console.log(currentIpAddress, ip);
  options.origin =
    whitelist.includes(currentIpAddress) ||
    whitelist.includes(req.header("Origin"))
      ? true
      : false;
  console.log(options);
  callback("", options);
};

app.use(cors(checkForvalidIp));
app.use(logger());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  "/",
  cors({ origin: "google.com" }),
  express.static(path.join(__dirname, "/public"))
);
app.use("/api", apiRoute);

module.exports = app;

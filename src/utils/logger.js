var fs = require("fs");
var winston = require("winston");
require("winston-daily-rotate-file");
var dateFormat = require("dateformat");
var dirLogPath = "./logs";
if (!fs.existsSync(dirLogPath)) {
  fs.mkdirSync(dirLogPath);
}

function customFileFormatter(options) {
  // Return string will be passed to logger.
  return (
    " [" +
    options.timestamp() +
    "] " +
    options.level.toUpperCase() +
    " " +
    (undefined !== options.message ? options.message : "") +
    (options.meta && Object.keys(options.meta).length
      ? "\n\t" + JSON.stringify(options.meta)
      : "")
  );
}
var transportInfo = new winston.transports.DailyRotateFile({
  filename: dirLogPath + "/info.log",
  maxsize: 30000000,
  maxFiles: 10,
  json: false,
  timestamp: function () {
    let now = Date.now();
    return dateFormat(now, "yyyy-mm-dd hh:MM:ss");
  },
  formatter: customFileFormatter,
  handleExceptions: true,
  humanReadableUnhandledException: true,
  level: "debug",
  datePattern: "dd-MM-yyyy_",
  prepend: true,
});
var transportError = new winston.transports.File({
  filename: dirLogPath + "/error.log",
  maxsize: 30000000,
  maxFiles: 10,
  json: false,
  timestamp: function () {
    let now = Date.now();
    return dateFormat(now, "yyyy-mm-dd hh:MM:ss");
  },
  formatter: customFileFormatter,
  handleExceptions: true,
  humanReadableUnhandledException: true,
  level: "error",
});
var transportConsole = new winston.transports.Console({
  json: false,
  timestamp: function () {
    let now = Date.now();
    return dateFormat(now, "yyyy-mm-dd hh:MM:ss");
  },
  formatter: customFileFormatter,
  handleExceptions: true,
  humanReadableUnhandledException: true,
  colorize: true,
  level: "debug",
});
var logger = new winston.Logger({
  transports: [transportConsole, transportInfo, transportError],
});
module.exports = function (mod) {
  var filename = mod.id;
  return {
    info: function (msg, vars) {
      args = this.formatLogArguments(arguments);
      logger.info.apply(logger, args);
    },
    debug: function (msg, vars) {
      args = this.formatLogArguments(arguments);
      logger.debug.apply(logger, args);
    },
    warn: function (msg, vars) {
      args = this.formatLogArguments(arguments);
      logger.warn.apply(logger, args);
    },
    error: function (msg, vars) {
      args = this.formatLogArguments(arguments);
      logger.error.apply(logger, args);
    },
    formatLogArguments: function (args) {
      var newArgs = Array.prototype.slice.call(args);
      newArgs[0] = filename + " - " + args[0];
      return newArgs;
    },
  };
};
